import * as vscode from "vscode";
import { logInfo } from "../../shared/logger";

// Re-export types
export type {
  ISynapseHealthParams,
  IMemorySearchParams,
  IArchitectureStatusParams,
  IMcpRecommendationParams,
  IUserProfileParams,
  IHeirValidationParams,
  ICognitiveStateParams,
  IUserProfile,
  ISelfActualizationParams,
  ICrossDomainSynthesisParams,
} from "./types";

// Re-export tool classes
export { SynapseHealthTool } from "./synapseHealthTool";
export { MemorySearchTool } from "./memorySearchTool";
export { ArchitectureStatusTool } from "./architectureStatusTool";
export { McpRecommendationTool } from "./mcpRecommendationTool";
export {
  UserProfileTool,
  getUserProfile,
  formatPersonalizedGreeting,
} from "./userProfileTool";
export { SelfActualizationTool } from "./selfActualizationTool";
export { HeirValidationTool } from "./heirValidationTool";
export { CognitiveStateUpdateTool } from "./cognitiveStateUpdateTool";
export { CrossDomainSynthesisTool } from "./crossDomainSynthesisTool";

// Import tool classes for registration
import { SynapseHealthTool } from "./synapseHealthTool";
import { MemorySearchTool } from "./memorySearchTool";
import { ArchitectureStatusTool } from "./architectureStatusTool";
import { McpRecommendationTool } from "./mcpRecommendationTool";
import { UserProfileTool } from "./userProfileTool";
import { SelfActualizationTool } from "./selfActualizationTool";
import { HeirValidationTool } from "./heirValidationTool";
import { CognitiveStateUpdateTool } from "./cognitiveStateUpdateTool";
import { CrossDomainSynthesisTool } from "./crossDomainSynthesisTool";

/**
 * Register all Alex language model tools
 */
export function registerLanguageModelTools(
  context: vscode.ExtensionContext,
): void {
  // Register Synapse Health Tool
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_synapse_health",
      new SynapseHealthTool(),
    ),
  );

  // Register Memory Search Tool
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_memory_search",
      new MemorySearchTool(),
    ),
  );

  // Register Architecture Status Tool
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_architecture_status",
      new ArchitectureStatusTool(),
    ),
  );

  // Register MCP Recommendation Tool
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_platform_mcp_recommendations",
      new McpRecommendationTool(),
    ),
  );

  // Register User Profile Tool
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_user_profile",
      new UserProfileTool(),
    ),
  );

  // Register Self-Actualization Tool
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_self_actualization",
      new SelfActualizationTool(),
    ),
  );

  // Register Heir Validation Tool (for LLM-based curation quality control)
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_quality_heir_validation",
      new HeirValidationTool(),
    ),
  );

  // Register Cognitive State Update Tool (primary avatar switching mechanism in agent mode)
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_state_update",
      new CognitiveStateUpdateTool(),
    ),
  );

  // Register Cross-Domain Synthesis Tool (generative meditation)
  context.subscriptions.push(
    vscode.lm.registerTool(
      "alex_cognitive_cross_domain_synthesis",
      new CrossDomainSynthesisTool(),
    ),
  );

  logInfo("Alex Language Model Tools registered");
}
