/**
 * Chat avatar bridge — decouples welcomeView from participant.ts.
 * 
 * participant.ts registers its updateChatAvatar implementation at activation.
 * welcomeView.ts calls the bridge without importing participant.ts.
 * Breaks circular dependency: extension.ts → welcomeView.ts → participant.ts
 * 
 * v5.9.1: Enhanced to support cognitive state and agent mode for dynamic avatar updates.
 */

/**
 * Context for avatar resolution.
 * Mirrors AvatarContext from avatarMappings.ts but simplified for bridge use.
 */
export interface ChatAvatarContext {
  /** Current agent mode (null for default Alex) */
  agentMode?: string | null;
  /** Detected cognitive state */
  cognitiveState?: string | null;
  /** Detected persona ID */
  personaId?: string | null;
  /** User's birthday for age fallback */
  birthday?: string | null;
}

type AvatarUpdater = (context?: ChatAvatarContext) => void;

let _avatarUpdater: AvatarUpdater | null = null;

/**
 * Register the avatar updater (called by participant.ts at registration time)
 */
export function registerAvatarUpdater(updater: AvatarUpdater): void {
  _avatarUpdater = updater;
}

/**
 * Update the @alex chat avatar based on current context.
 * No-op if participant hasn't registered yet.
 * 
 * Priority: agentMode > cognitiveState > persona > age > default
 * 
 * @param context - Avatar context with optional agentMode, cognitiveState, personaId, birthday
 */
export function updateChatAvatar(context?: ChatAvatarContext): void {
  _avatarUpdater?.(context);
}

/**
 * Legacy helper - update avatar with just persona ID.
 * @deprecated Use updateChatAvatar({ personaId }) instead
 */
export function updateChatAvatarByPersona(personaId?: string): void {
  _avatarUpdater?.({ personaId });
}
