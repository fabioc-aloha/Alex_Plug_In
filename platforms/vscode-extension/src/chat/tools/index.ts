import * as vscode from 'vscode';
import { logInfo } from '../../shared/logger';

// Re-export types
export type {
    ISynapseHealthParams,
    IMemorySearchParams,
    IArchitectureStatusParams,
    IMcpRecommendationParams,
    IUserProfileParams,
    IFocusContextParams,
    IHeirValidationParams,
    ICognitiveStateParams,
    IUserProfile,
    ISelfActualizationParams,
    IFocusContextResponse,
} from './types';

// Re-export tool classes
export { SynapseHealthTool } from './synapseHealthTool';
export { MemorySearchTool } from './memorySearchTool';
export { ArchitectureStatusTool } from './architectureStatusTool';
export { McpRecommendationTool } from './mcpRecommendationTool';
export { UserProfileTool, getUserProfile, formatPersonalizedGreeting } from './userProfileTool';
export { FocusContextTool } from './focusContextTool';
export { SelfActualizationTool } from './selfActualizationTool';
export { HeirValidationTool } from './heirValidationTool';
export { CognitiveStateUpdateTool } from './cognitiveStateUpdateTool';

// Import tool classes for registration
import { SynapseHealthTool } from './synapseHealthTool';
import { MemorySearchTool } from './memorySearchTool';
import { ArchitectureStatusTool } from './architectureStatusTool';
import { McpRecommendationTool } from './mcpRecommendationTool';
import { UserProfileTool } from './userProfileTool';
import { FocusContextTool } from './focusContextTool';
import { SelfActualizationTool } from './selfActualizationTool';
import { HeirValidationTool } from './heirValidationTool';
import { CognitiveStateUpdateTool } from './cognitiveStateUpdateTool';

/**
 * Register all Alex language model tools
 */
export function registerLanguageModelTools(context: vscode.ExtensionContext): void {
    
    // Register Synapse Health Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_synapse_health', new SynapseHealthTool())
    );
    
    // Register Memory Search Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_memory_search', new MemorySearchTool())
    );
    
    // Register Architecture Status Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_architecture_status', new ArchitectureStatusTool())
    );
    
    // Register MCP Recommendation Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_platform_mcp_recommendations', new McpRecommendationTool())
    );
    
    // Register User Profile Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_user_profile', new UserProfileTool())
    );
    
    // Register Focus Context Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_focus_context', new FocusContextTool())
    );
    
    // Register Self-Actualization Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_self_actualization', new SelfActualizationTool())
    );
    
    // Register Heir Validation Tool (for LLM-based curation quality control)
    context.subscriptions.push(
        vscode.lm.registerTool('alex_quality_heir_validation', new HeirValidationTool())
    );
    
    // Register Cognitive State Update Tool (primary avatar switching mechanism in agent mode)
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cognitive_state_update', new CognitiveStateUpdateTool())
    );
    
    logInfo('Alex Language Model Tools registered');
}
