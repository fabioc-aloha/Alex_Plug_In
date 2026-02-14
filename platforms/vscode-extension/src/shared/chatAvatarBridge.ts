/**
 * Chat avatar bridge — decouples welcomeView from participant.ts.
 * 
 * participant.ts registers its updateChatAvatar implementation at activation.
 * welcomeView.ts calls the bridge without importing participant.ts.
 * Breaks circular dependency: extension.ts → welcomeView.ts → participant.ts
 */

type AvatarUpdater = (personaId?: string) => void;

let _avatarUpdater: AvatarUpdater | null = null;

/**
 * Register the avatar updater (called by participant.ts at registration time)
 */
export function registerAvatarUpdater(updater: AvatarUpdater): void {
  _avatarUpdater = updater;
}

/**
 * Update the @alex chat avatar to match the detected persona.
 * No-op if participant hasn't registered yet.
 */
export function updateChatAvatar(personaId?: string): void {
  _avatarUpdater?.(personaId);
}
