/**
 * GitHub Integration
 * 
 * Import GitHub issues as Alex learning goals.
 * Uses VS Code's built-in GitHub authentication.
 */

import * as vscode from 'vscode';
import { createGoal, LearningGoal } from './goals';
import { openChatPanel } from '../shared/utils';

// Rate limit tracking
let rateLimitRemaining = 5000;
let rateLimitReset = 0;

export interface GitHubIssue {
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    labels: Array<{ name: string; color: string }>;
    state: 'open' | 'closed';
    created_at: string;
    updated_at: string;
    milestone?: { title: string } | null;
}

export interface GitHubRepo {
    owner: string;
    repo: string;
}

/**
 * Check if rate limited and show user-friendly message
 */
function checkRateLimit(): boolean {
    if (rateLimitRemaining <= 0 && Date.now() < rateLimitReset) {
        const resetDate = new Date(rateLimitReset);
        const minutes = Math.ceil((rateLimitReset - Date.now()) / 60000);
        vscode.window.showWarningMessage(
            `GitHub API rate limited. Resets in ${minutes} minute(s) at ${resetDate.toLocaleTimeString()}.`
        );
        return true;
    }
    return false;
}

/**
 * Update rate limit info from response headers
 */
function updateRateLimitFromResponse(response: Response): void {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining) { rateLimitRemaining = parseInt(remaining, 10); }
    if (reset) { rateLimitReset = parseInt(reset, 10) * 1000; } // Convert to ms
}

/**
 * Get GitHub session with repo scope
 */
async function getGitHubSession(): Promise<vscode.AuthenticationSession | null> {
    try {
        const session = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
        return session;
    } catch (error) {
        vscode.window.showErrorMessage('GitHub authentication failed. Please sign in to GitHub.');
        return null;
    }
}

/**
 * Parse GitHub repo from remote URL or workspace
 */
export async function detectGitHubRepo(): Promise<GitHubRepo | null> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return null;
    }

    try {
        // Try to read .git/config
        const gitConfigUri = vscode.Uri.joinPath(workspaceFolder.uri, '.git', 'config');
        const configContent = (await vscode.workspace.fs.readFile(gitConfigUri)).toString();
        
        // Parse remote origin URL
        const remoteMatch = configContent.match(/\[remote "origin"\][^\[]*url\s*=\s*(.+)/);
        if (!remoteMatch) {
            return null;
        }

        const url = remoteMatch[1].trim();
        
        // Parse GitHub URL formats
        // https://github.com/owner/repo.git
        // git@github.com:owner/repo.git
        const httpsMatch = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
        if (httpsMatch) {
            return { owner: httpsMatch[1], repo: httpsMatch[2].replace(/\.git$/, '') };
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Fetch issues from GitHub repo
 */
export async function fetchGitHubIssues(
    repo: GitHubRepo,
    options: {
        labels?: string[];
        state?: 'open' | 'closed' | 'all';
        limit?: number;
    } = {}
): Promise<GitHubIssue[]> {
    if (checkRateLimit()) { return []; }
    
    const session = await getGitHubSession();
    if (!session) {
        return [];
    }

    const { labels = [], state = 'open', limit = 20 } = options;

    try {
        let url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/issues?state=${state}&per_page=${limit}`;
        if (labels.length > 0) {
            url += `&labels=${labels.join(',')}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Alex-Cognitive-Architecture'
            }
        });

        updateRateLimitFromResponse(response);
        
        if (response.status === 403 && rateLimitRemaining === 0) {
            checkRateLimit();
            return [];
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const issues = await response.json() as GitHubIssue[];
        // Filter out pull requests (they come in issues endpoint too)
        return issues.filter(issue => !('pull_request' in issue));
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch issues: ${error instanceof Error ? error.message : String(error)}`);
        return [];
    }
}

/**
 * Convert GitHub issue to learning goal
 */
function issueToGoal(issue: GitHubIssue, repo: GitHubRepo): Partial<LearningGoal> {
    // Infer target type from labels
    let targetType: 'daily' | 'weekly' | 'custom' = 'custom';
    if (issue.labels.some(l => l.name.toLowerCase().includes('quick') || l.name.toLowerCase().includes('small'))) {
        targetType = 'daily';
    } else if (issue.labels.some(l => l.name.toLowerCase().includes('medium') || l.name.toLowerCase().includes('feature'))) {
        targetType = 'weekly';
    }

    // Extract tags from labels
    const tags = issue.labels
        .map(l => l.name)
        .filter(name => !['quick', 'small', 'medium', 'large', 'feature'].includes(name.toLowerCase()));

    return {
        title: `#${issue.number}: ${issue.title}`,
        description: issue.body 
            ? issue.body.substring(0, 500) + (issue.body.length > 500 ? '...' : '')
            : `GitHub issue from ${repo.owner}/${repo.repo}`,
        targetType,
        targetCount: 1,
        unit: 'completion',
        tags: [`github:${repo.owner}/${repo.repo}`, ...tags],
    };
}

/**
 * Show issue picker and import selected issues as goals
 */
export async function importGitHubIssuesAsGoals(): Promise<LearningGoal[]> {
    // Detect repo
    const repo = await detectGitHubRepo();
    if (!repo) {
        // Ask user to enter repo
        const repoInput = await vscode.window.showInputBox({
            prompt: 'Enter GitHub repository (owner/repo)',
            placeHolder: 'e.g., microsoft/vscode',
            validateInput: (value) => {
                if (!value.includes('/')) {
                    return 'Format: owner/repo';
                }
                return null;
            }
        });

        if (!repoInput) {
            return [];
        }

        const [owner, repoName] = repoInput.split('/');
        return importFromRepo({ owner, repo: repoName });
    }

    return importFromRepo(repo);
}

async function importFromRepo(repo: GitHubRepo): Promise<LearningGoal[]> {
    const issues = await fetchGitHubIssues(repo, { state: 'open', limit: 50 });

    if (issues.length === 0) {
        vscode.window.showInformationMessage(`No open issues found in ${repo.owner}/${repo.repo}`);
        return [];
    }

    // Show quick pick with issues
    interface IssueQuickPickItem extends vscode.QuickPickItem {
        issue: GitHubIssue;
    }

    const items: IssueQuickPickItem[] = issues.map(issue => ({
        label: `#${issue.number}: ${issue.title}`,
        description: issue.labels.map(l => l.name).join(', '),
        detail: issue.body?.substring(0, 100) || undefined,
        issue,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        title: `📋 Import Issues from ${repo.owner}/${repo.repo}`,
        placeHolder: 'Select issues to import as learning goals',
        canPickMany: true,
    });

    if (!selected || selected.length === 0) {
        return [];
    }

    // Create goals from selected issues
    const createdGoals: LearningGoal[] = [];
    for (const item of selected) {
        const goalData = issueToGoal(item.issue, repo);
        const goal = await createGoal(
            goalData.title!,
            goalData.targetType!,
            goalData.targetCount!,
            goalData.unit!,
            goalData.description,
            goalData.tags
        );
        createdGoals.push(goal);
    }

    vscode.window.showInformationMessage(`📋 Imported ${createdGoals.length} issue(s) as learning goals`);
    return createdGoals;
}

/**
 * Open GitHub issue in browser
 */
export async function openIssueInBrowser(issueNumber: number): Promise<void> {
    const repo = await detectGitHubRepo();
    if (!repo) {
        vscode.window.showWarningMessage('Not in a GitHub repository');
        return;
    }

    const url = `https://github.com/${repo.owner}/${repo.repo}/issues/${issueNumber}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
}

/**
 * PR Review Assistant
 * 
 * Fetches PR diff and generates a review prompt for Copilot.
 */

export interface GitHubPullRequest {
    number: number;
    title: string;
    body: string | null;
    html_url: string;
    state: 'open' | 'closed' | 'merged';
    head: { ref: string };
    base: { ref: string };
    additions: number;
    deletions: number;
    changed_files: number;
    labels: Array<{ name: string }>;
}

/**
 * Fetch open PRs from GitHub repo
 */
export async function fetchGitHubPRs(
    repo: GitHubRepo,
    options: { state?: 'open' | 'closed' | 'all'; limit?: number } = {}
): Promise<GitHubPullRequest[]> {
    if (checkRateLimit()) { return []; }
    
    const session = await getGitHubSession();
    if (!session) {
        return [];
    }

    const { state = 'open', limit = 20 } = options;

    try {
        const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/pulls?state=${state}&per_page=${limit}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Alex-Cognitive-Architecture'
            }
        });

        updateRateLimitFromResponse(response);
        
        if (response.status === 403 && rateLimitRemaining === 0) {
            checkRateLimit();
            return [];
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as GitHubPullRequest[];
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch PRs: ${error instanceof Error ? error.message : String(error)}`);
        return [];
    }
}

/**
 * Fetch PR diff
 */
export async function fetchPRDiff(repo: GitHubRepo, prNumber: number): Promise<string> {
    if (checkRateLimit()) { return ''; }
    
    const session = await getGitHubSession();
    if (!session) {
        return '';
    }

    try {
        const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/pulls/${prNumber}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Accept': 'application/vnd.github.v3.diff',
                'User-Agent': 'Alex-Cognitive-Architecture'
            }
        });

        updateRateLimitFromResponse(response);
        
        if (response.status === 403 && rateLimitRemaining === 0) {
            checkRateLimit();
            return '';
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch PR diff: ${error instanceof Error ? error.message : String(error)}`);
        return '';
    }
}

/**
 * Review PR - Shows picker and generates review prompt
 */
export async function reviewPullRequest(): Promise<void> {
    // Detect repo
    let repo = await detectGitHubRepo();
    if (!repo) {
        const repoInput = await vscode.window.showInputBox({
            prompt: 'Enter GitHub repository (owner/repo)',
            placeHolder: 'e.g., microsoft/vscode',
        });

        if (!repoInput || !repoInput.includes('/')) {
            return;
        }

        const [owner, repoName] = repoInput.split('/');
        repo = { owner, repo: repoName };
    }

    const prs = await fetchGitHubPRs(repo, { state: 'open', limit: 30 });

    if (prs.length === 0) {
        vscode.window.showInformationMessage(`No open PRs found in ${repo.owner}/${repo.repo}`);
        return;
    }

    interface PRQuickPickItem extends vscode.QuickPickItem {
        pr: GitHubPullRequest;
    }

    const items: PRQuickPickItem[] = prs.map(pr => ({
        label: `#${pr.number}: ${pr.title}`,
        description: `${pr.head.ref} → ${pr.base.ref}`,
        detail: `+${pr.additions} -${pr.deletions} | ${pr.changed_files} files`,
        pr,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        title: `🔍 Review PR in ${repo.owner}/${repo.repo}`,
        placeHolder: 'Select a pull request to review',
    });

    if (!selected) {
        return;
    }

    // Fetch diff
    const diff = await fetchPRDiff(repo, selected.pr.number);

    if (!diff) {
        vscode.window.showWarningMessage('Could not fetch PR diff');
        return;
    }

    // Truncate very large diffs
    const maxDiffLength = 15000;
    const truncatedDiff = diff.length > maxDiffLength 
        ? diff.substring(0, maxDiffLength) + '\n\n... [diff truncated for review] ...'
        : diff;

    // Generate review prompt
    const prompt = `Review this pull request:

**PR #${selected.pr.number}: ${selected.pr.title}**
Branch: \`${selected.pr.head.ref}\` → \`${selected.pr.base.ref}\`
Changes: +${selected.pr.additions} -${selected.pr.deletions} in ${selected.pr.changed_files} files

${selected.pr.body ? `**Description:**\n${selected.pr.body}\n` : ''}

**Diff:**
\`\`\`diff
${truncatedDiff}
\`\`\`

Please review this PR for:
1. **Code quality** — readability, maintainability, patterns
2. **Bugs** — potential issues, edge cases, error handling
3. **Security** — vulnerabilities, input validation, secrets
4. **Performance** — inefficiencies, memory leaks
5. **Tests** — coverage, missing test cases

Provide specific, actionable feedback with line references where applicable.`;

    // Copy to clipboard and open chat
    await vscode.env.clipboard.writeText(prompt);
    await openChatPanel();
    vscode.window.showInformationMessage(`📋 PR #${selected.pr.number} review prompt copied. Paste in Agent chat (Ctrl+V).`);
}
