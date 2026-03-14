import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../../shared/workspaceFs';
import { validateUserProfile, safeJsonParse, createConfigBackup } from '../../shared/sanitize';
import { IUserProfileParams, IUserProfile } from './types';

/**
 * User Profile Tool - Manages user preferences and personalization
 */
export class UserProfileTool implements vscode.LanguageModelTool<IUserProfileParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IUserProfileParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        const action = options.input.action || 'get';
        const actionMessages: Record<string, string> = {
            get: 'Reading user profile...',
            update: `Updating user profile: ${options.input.field}...`,
            exists: 'Checking if user profile exists...'
        };
        
        return {
            invocationMessage: actionMessages[action] || 'Accessing user profile...',
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IUserProfileParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        // Update welcome view avatar — user profile access = learning state
        vscode.commands.executeCommand('alex.setCognitiveState', 'learning');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Cannot access user profile.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const jsonProfilePath = path.join(rootPath, '.github', 'config', 'user-profile.json');

        const { action, field, value } = options.input;

        try {
            switch (action) {
                case 'exists':
                    const exists = await workspaceFs.pathExists(jsonProfilePath);
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(JSON.stringify({ exists, path: jsonProfilePath }))
                    ]);

                case 'get':
                    if (!await workspaceFs.pathExists(jsonProfilePath)) {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(JSON.stringify({
                                exists: false,
                                message: 'No user profile found. I should ask the user about themselves to create one.',
                                suggestedQuestions: [
                                    "What's your name?",
                                    "What's your role (developer, architect, etc.)?",
                                    "Do you prefer casual or formal communication?",
                                    "What technologies do you work with most?"
                                ]
                            }))
                        ]);
                    }
                    
                    // P0: Safe JSON parsing with error recovery
                    const profileContent = await workspaceFs.readFile(jsonProfilePath);
                    const parseResult = safeJsonParse<IUserProfile>(profileContent);
                    
                    if (!parseResult.success) {
                        // Create backup before reporting error
                        await createConfigBackup(jsonProfilePath);
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(JSON.stringify({
                                error: true,
                                message: `Profile JSON is corrupted: ${parseResult.error}. A backup was created.`,
                                suggestedAction: 'recreate'
                            }))
                        ]);
                    }
                    
                    // P0: Validate profile schema
                    const validation = validateUserProfile(parseResult.data);
                    if (!validation.valid) {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(JSON.stringify({
                                warning: true,
                                message: `Profile has validation issues: ${validation.errors.join(', ')}`,
                                profile: parseResult.data, // Still return the data
                                recovered: parseResult.recovered
                            }))
                        ]);
                    }
                    
                    const profile = validation.sanitized || parseResult.data;
                    if (field && profile) {
                        // Type-safe dynamic field access via index signature
                        const profileRecord = profile as IUserProfile;
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(JSON.stringify({ [field]: profileRecord[field] }))
                        ]);
                    }
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(JSON.stringify(profile))
                    ]);

                case 'update':
                    if (!field || value === undefined) {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart('Error: Both field and value are required for update action.')
                        ]);
                    }

                    // Ensure config directory exists
                    await workspaceFs.ensureDir(path.join(rootPath, '.github', 'config'));

                    // Read existing profile or create new one
                    let existingProfile: IUserProfile = {};
                    if (await workspaceFs.pathExists(jsonProfilePath)) {
                        existingProfile = await workspaceFs.readJson(jsonProfilePath) as IUserProfile;
                    }

                    // Handle array fields
                    if (['primaryTechnologies', 'learningGoals', 'expertiseAreas'].includes(field)) {
                        const currentArray = existingProfile[field] as string[] || [];
                        if (Array.isArray(currentArray)) {
                            if (!currentArray.includes(value)) {
                                existingProfile[field] = [...currentArray, value];
                            }
                        } else {
                            existingProfile[field] = [value];
                        }
                    } else {
                        existingProfile[field] = value;
                    }

                    // Update timestamp
                    existingProfile.lastUpdated = new Date().toISOString();

                    // Save JSON profile
                    await workspaceFs.writeJson(jsonProfilePath, existingProfile);

                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(JSON.stringify({
                            success: true,
                            field,
                            value,
                            message: `Updated ${field} to: ${value}`
                        }))
                    ]);

                default:
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(`Unknown action: ${action}`)
                    ]);
            }
        } catch (error: unknown) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`Error accessing user profile: ${error instanceof Error ? error.message : String(error)}`)
            ]);
        }
    }
}

/**
 * Helper function to get user profile from workspace
 * Returns actual profile if exists, otherwise returns template defaults in-memory
 * (without creating a file - profile is created through conversation)
 */
export async function getUserProfile(): Promise<IUserProfile | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return null;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const jsonProfilePath = path.join(rootPath, '.github', 'config', 'user-profile.json');

    try {
        // Return actual profile if it exists
        if (await workspaceFs.pathExists(jsonProfilePath)) {
            return await workspaceFs.readJson<IUserProfile>(jsonProfilePath);
        }
        
        // Return template defaults in-memory (no file created)
        // Profile file is created when user provides info through conversation
        const templatePath = path.join(rootPath, '.github', 'config', 'user-profile.template.json');
        if (await workspaceFs.pathExists(templatePath)) {
            return await workspaceFs.readJson<IUserProfile>(templatePath);
        }
    } catch (error) {
        console.error('Error reading user profile:', error);
    }

    return null;
}

/**
 * Helper function to format greeting based on user profile
 */
export function formatPersonalizedGreeting(profile: IUserProfile | null): string {
    if (!profile || !profile.name) {
        return "Hello! I'm Alex, your cognitive learning partner.";
    }

    const name = profile.nickname || profile.name;
    const greetings = [
        `Hey ${name}! Great to see you.`,
        `Hello ${name}! Ready to dive in?`,
        `Hi ${name}! What are we working on today?`,
        `Welcome back, ${name}!`
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
}
