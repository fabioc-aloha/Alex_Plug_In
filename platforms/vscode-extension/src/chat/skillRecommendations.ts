/**
 * Skill Recommendations Module
 * 
 * Suggests relevant skills based on workspace context, file types, and user behavior.
 * Implements context-aware skill loading to prioritize relevant skills in LLM context.
 * 
 * v5.7.5 Feature: Skill Intelligence
 * 
 * RECOMMENDATION MODEL:
 * - Technology-based: Detect tech stack → suggest related skills
 * - File-type-based: Active file extension → suggest file-specific skills
 * - Behavior-based: User patterns (commits, errors, time) → suggest workflow skills
 * - Context-based: Workspace state detection → suggest situational skills
 * 
 * SKILL PRIORITIZATION:
 * - High: Persona-specific + file-type match
 * - Medium: Technology stack + workspace context
 * - Low: Generic/organizational skills
 */

import * as vscode from 'vscode';
import { detectProjectTechnologies } from './personaDetection';

// ============================================================================
// SKILL RECOMMENDATION TYPES
// ============================================================================

export interface SkillRecommendation {
    /** Skill folder name */
    skillId: string;
    /** Display name for UI */
    displayName: string;
    /** Why this skill is being recommended */
    reason: string;
    /** Confidence score 0-1 */
    confidence: number;
    /** Priority tier: high, medium, low */
    priority: 'high' | 'medium' | 'low';
}

export interface SkillLoadingContext {
    /** Skills to load with high priority */
    highPriority: string[];
    /** Skills to load with medium priority */
    mediumPriority: string[];
    /** Skills to deprioritize */
    lowPriority: string[];
}

// ============================================================================
// SKILL-TO-TECHNOLOGY MAPPING
// ============================================================================

/**
 * Maps detected technologies to relevant skills
 * Key: technology name (from detectProjectTechnologies)
 * Value: array of skill IDs
 */
const TECH_TO_SKILLS: Record<string, string[]> = {
    // Azure ecosystem
    'bicep': ['azure-architecture-patterns', 'bicep-avm-mastery', 'infrastructure-as-code'],
    'azure': ['azure-architecture-patterns', 'azure-devops-automation', 'cloud-cost-optimization'],
    'terraform': ['infrastructure-as-code', 'cloud-cost-optimization'],
    'docker': ['infrastructure-as-code', 'deployment-strategies'],
    'kubernetes': ['infrastructure-as-code', 'cloud-architecture'],
    
    // Programming languages
    'typescript': ['code-review', 'testing-strategies', 'api-design', 'refactoring-patterns'],
    'javascript': ['code-review', 'testing-strategies', 'api-design'],
    'python': ['code-review', 'testing-strategies', 'api-design', 'data-analysis'],
    'rust': ['code-review', 'performance-optimization', 'api-design'],
    'go': ['code-review', 'api-design', 'microservices-patterns'],
    'csharp': ['code-review', 'testing-strategies', 'api-design'],
    
    // Frameworks
    'react': ['react-patterns', 'testing-strategies', 'ui-ux-design'],
    'vue': ['testing-strategies', 'ui-ux-design'],
    'angular': ['testing-strategies', 'ui-ux-design'],
    
    // Development tools
    'git': ['git-workflow', 'code-review', 'release-management'],
    'github-actions': ['ci-cd-patterns', 'deployment-strategies'],
    'azure-devops': ['azure-devops-automation', 'ci-cd-patterns'],
    
    // Data & Analytics
    'sql': ['database-design', 'query-optimization'],
    'mongodb': ['database-design', 'api-design'],
    'redis': ['caching-strategies', 'performance-optimization'],
    'postgresql': ['database-design', 'query-optimization'],
    
    // Testing
    'jest': ['testing-strategies', 'code-quality'],
    'pytest': ['testing-strategies', 'code-quality'],
    'mocha': ['testing-strategies', 'code-quality'],
    
    // Documentation
    'markdown': ['api-documentation', 'technical-writing'],
    'latex': ['academic-paper-drafting', 'citation-management'],
    
    // Research & Academic
    'research': ['research-project-scaffold', 'literature-review', 'citation-management'],
    'jupyter': ['data-analysis', 'research-project-scaffold'],
    
    // Creative
    'writing': ['creative-writing', 'character-development', 'plot-structure'],
    'fiction': ['creative-writing', 'character-development', 'worldbuilding'],
    
    // Data Engineering
    'spark': ['microsoft-fabric', 'data-pipeline-design'],
    'databricks': ['microsoft-fabric', 'data-pipeline-design'],
    
    // Presentations
    'presentations': ['gamma-presentation', 'slide-design', 'pptx-generation'],
};

/**
 * Maps file extensions to relevant skills
 */
const FILE_EXT_TO_SKILLS: Record<string, string[]> = {
    '.bicep': ['azure-architecture-patterns', 'bicep-avm-mastery'],
    '.tf': ['infrastructure-as-code', 'terraform-patterns'],
    '.ts': ['code-review', 'testing-strategies', 'refactoring-patterns'],
    '.tsx': ['react-patterns', 'ui-ux-design', 'testing-strategies'],
    '.js': ['code-review', 'testing-strategies'],
    '.jsx': ['react-patterns', 'testing-strategies'],
    '.py': ['code-review', 'testing-strategies', 'data-analysis'],
    '.md': ['api-documentation', 'technical-writing'],
    '.tex': ['academic-paper-drafting', 'citation-management'],
    '.ipynb': ['data-analysis', 'research-project-scaffold'],
    '.rs': ['performance-optimization', 'code-review'],
    '.go': ['microservices-patterns', 'api-design'],
    '.cs': ['code-review', 'testing-strategies'],
    '.sql': ['database-design', 'query-optimization'],
};

/**
 * Persona-to-skill mapping (from personaDetection.ts personas)
 */
const PERSONA_TO_SKILLS: Record<string, string[]> = {
    'developer': ['code-review', 'testing-strategies', 'git-workflow', 'refactoring-patterns'],
    'academic': ['academic-paper-drafting', 'citation-management', 'literature-review'],
    'researcher': ['research-project-scaffold', 'data-analysis', 'literature-review'],
    'technical-writer': ['api-documentation', 'technical-writing', 'markdown-mermaid'],
    'architect': ['architecture-health', 'system-design', 'adr-documentation'],
    'data-engineer': ['microsoft-fabric', 'data-pipeline-design', 'database-design'],
    'devops': ['infrastructure-as-code', 'ci-cd-patterns', 'deployment-strategies'],
    'content-creator': ['gamma-presentation', 'slide-design', 'creative-writing'],
    'creative-writer': ['creative-writing', 'character-development', 'plot-structure'],
    'game-dev': ['game-design', 'narrative-design', 'level-design'],
    'oss-contributor': ['git-workflow', 'code-review', 'community-guidelines'],
    'consultant': ['business-analysis', 'proposal-writing', 'stakeholder-communication'],
    'qa-engineer': ['testing-strategies', 'code-quality', 'bug-triage'],
    'security-engineer': ['security-patterns', 'threat-modeling', 'code-review'],
    'product-manager': ['user-story-mapping', 'roadmap-planning', 'stakeholder-communication'],
    'student': ['learning-strategies', 'note-taking', 'study-techniques'],
    'educator': ['course-design', 'lesson-planning', 'assessment-design'],
    'bi-analyst': ['data-visualization', 'dashboard-design', 'business-metrics'],
};

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

/**
 * Get skill recommendations based on current workspace context
 */
export async function getSkillRecommendations(
    workspaceRoot?: string,
    activeFilePath?: string,
    personaId?: string
): Promise<SkillRecommendation[]> {
    const recommendations: SkillRecommendation[] = [];

    // 1. File-type based recommendations (high confidence)
    if (activeFilePath) {
        const ext = activeFilePath.substring(activeFilePath.lastIndexOf('.'));
        const fileSkills = FILE_EXT_TO_SKILLS[ext] || [];
        
        for (const skillId of fileSkills) {
            recommendations.push({
                skillId,
                displayName: formatSkillName(skillId),
                reason: `Working with ${ext} file`,
                confidence: 0.9,
                priority: 'high'
            });
        }
    }

    // 2. Technology-based recommendations (medium confidence)
    if (workspaceRoot) {
        const technologies = await detectProjectTechnologies(workspaceRoot);
        
        for (const tech of technologies) {
            const techSkills = TECH_TO_SKILLS[tech] || [];
            
            for (const skillId of techSkills) {
                // Avoid duplicates
                if (recommendations.some(r => r.skillId === skillId)) {
                    continue;
                }
                
                recommendations.push({
                    skillId,
                    displayName: formatSkillName(skillId),
                    reason: `Detected ${tech} in workspace`,
                    confidence: 0.75,
                    priority: 'medium'
                });
            }
        }
    }

    // 3. Persona-based recommendations (medium confidence)
    if (personaId) {
        const personaSkills = PERSONA_TO_SKILLS[personaId] || [];
        
        for (const skillId of personaSkills) {
            // Avoid duplicates
            if (recommendations.some(r => r.skillId === skillId)) {
                continue;
            }
            
            recommendations.push({
                skillId,
                displayName: formatSkillName(skillId),
                reason: `Relevant for ${personaId} persona`,
                confidence: 0.7,
                priority: 'medium'
            });
        }
    }

    // Sort by confidence (descending)
    recommendations.sort((a, b) => b.confidence - a.confidence);

    // Return top 5 recommendations
    return recommendations.slice(0, 5);
}

/**
 * Get context-aware skill loading priorities
 */
export async function getSkillLoadingContext(
    workspaceRoot?: string,
    activeFilePath?: string,
    personaId?: string
): Promise<SkillLoadingContext> {
    const recommendations = await getSkillRecommendations(workspaceRoot, activeFilePath, personaId);
    
    const highPriority: string[] = [];
    const mediumPriority: string[] = [];
    const lowPriority: string[] = [];

    for (const rec of recommendations) {
        if (rec.priority === 'high') {
            highPriority.push(rec.skillId);
        } else if (rec.priority === 'medium') {
            mediumPriority.push(rec.skillId);
        } else {
            lowPriority.push(rec.skillId);
        }
    }

    return {
        highPriority,
        mediumPriority,
        lowPriority
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert skill ID to display name
 * Example: 'azure-architecture-patterns' → 'Azure Architecture Patterns'
 */
function formatSkillName(skillId: string): string {
    return skillId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Track user preference for a skill recommendation
 * (acceptance or dismissal)
 */
export async function trackRecommendationFeedback(
    skillId: string,
    accepted: boolean
): Promise<void> {
    try {
        const context = 'alex.skillRecommendations';
        const key = `${skillId}.${accepted ? 'accepted' : 'dismissed'}`;
        
        // Get current count
        const currentCount = vscode.workspace.getConfiguration(context).get<number>(key, 0);
        
        // Increment
        await vscode.workspace.getConfiguration(context).update(
            key,
            currentCount + 1,
            vscode.ConfigurationTarget.Global
        );
    } catch (error) {
        // Configuration not registered - fail silently to not block skill launching
        console.log(`[Alex] Skipping recommendation tracking (config not registered): ${error}`);
    }
}

/**
 * Check if a skill recommendation was previously dismissed
 */
export async function wasRecommendationDismissed(skillId: string): Promise<boolean> {
    const context = 'alex.skillRecommendations';
    const dismissedCount = vscode.workspace.getConfiguration(context).get<number>(
        `${skillId}.dismissed`,
        0
    );
    
    // If dismissed more than 2 times, don't recommend again
    return dismissedCount > 2;
}
