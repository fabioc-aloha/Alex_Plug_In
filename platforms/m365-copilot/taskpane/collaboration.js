/**
 * Real-time Collaboration Awareness for Alex Office Add-in
 * Shows who's viewing/editing the document and provides live presence indicators
 * 
 * Version: v5.9.0
 */

let collaborators = new Map();
let presenceCheckInterval = null;
let currentUserId = null;

/**
 * Initialize collaboration awareness
 */
async function initializeCollaboration() {
    try {
        // Get current user info
        const userInfo = await getCurrentUserInfo();
        currentUserId = userInfo.id;

        // Start presence polling
        startPresencePolling();

        // Setup document change listeners
        setupDocumentListeners();

        console.log('Collaboration awareness initialized');
    } catch (error) {
        console.error('Collaboration initialization error:', error);
    }
}

/**
 * Get current user information via Microsoft Graph
 * @returns {Promise<{id: string, name: string, email: string}>}
 */
async function getCurrentUserInfo() {
    try {
        const token = await getGraphAccessToken();
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get user info');
        }

        const user = await response.json();
        return {
            id: user.id,
            name: user.displayName,
            email: user.mail || user.userPrincipalName
        };
    } catch (error) {
        console.error('Get user info error:', error);
        return {
            id: 'anonymous',
            name: 'Unknown User',
            email: ''
        };
    }
}

/**
 * Start polling for presence information
 */
function startPresencePolling() {
    // Poll every 30 seconds
    presenceCheckInterval = setInterval(async () => {
        await updatePresence();
    }, 30000);

    // Initial check
    updatePresence();
}

/**
 * Stop presence polling
 */
function stopPresencePolling() {
    if (presenceCheckInterval) {
        clearInterval(presenceCheckInterval);
        presenceCheckInterval = null;
    }
}

/**
 * Update presence information for document collaborators
 */
async function updatePresence() {
    try {
        // Get document collaborators from SharePoint/OneDrive
        const documentCollaborators = await getDocumentCollaborators();

        // Get presence for each collaborator
        for (const collaborator of documentCollaborators) {
            if (collaborator.id === currentUserId) continue; // Skip self

            const presence = await getUserPresence(collaborator.id);
            
            collaborators.set(collaborator.id, {
                ...collaborator,
                presence: presence.availability,
                activity: presence.activity,
                lastSeen: new Date()
            });
        }

        // Update UI
        renderCollaborators();

    } catch (error) {
        console.error('Presence update error:', error);
    }
}

/**
 * Get document collaborators from Microsoft Graph
 * @returns {Promise<Array<{id: string, name: string, email: string}>>}
 */
async function getDocumentCollaborators() {
    try {
        // This would query the document's sharing permissions
        // For now, return empty array as placeholder
        // TODO: Implement actual Graph API call to get document permissions

        const token = await getGraphAccessToken();
        
        // Would need document ID from Office.context.document
        // const documentId = await getDocumentId();
        // const url = `https://graph.microsoft.com/v1.0/me/drive/items/${documentId}/permissions`;

        return []; // Placeholder

    } catch (error) {
        console.error('Get collaborators error:', error);
        return [];
    }
}

/**
 * Get presence for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<{availability: string, activity: string}>}
 */
async function getUserPresence(userId) {
    try {
        const token = await getGraphAccessToken();
        const response = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}/presence`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { availability: 'Unknown', activity: 'Unknown' };
        }

        const presence = await response.json();
        return {
            availability: presence.availability, // Available, Busy, Away, Offline, etc.
            activity: presence.activity // InACall, InAMeeting, etc.
        };

    } catch (error) {
        console.error('Get presence error:', error);
        return { availability: 'Unknown', activity: 'Unknown' };
    }
}

/**
 * Setup document change listeners
 */
function setupDocumentListeners() {
    const host = Office.context.host;

    switch (host) {
        case Office.HostType.Word:
            setupWordListeners();
            break;
        case Office.HostType.Excel:
            setupExcelListeners();
            break;
        case Office.HostType.PowerPoint:
            setupPowerPointListeners();
            break;
        default:
            console.log('Document listeners not supported for this host');
    }
}

/**
 * Setup Word-specific change listeners
 */
function setupWordListeners() {
    // Word API doesn't have real-time change events
    // Would need to poll document.getSelection() or use settings
    console.log('Word listeners: Limited API support');
}

/**
 * Setup Excel-specific change listeners
 */
function setupExcelListeners() {
    if (Office.context.host !== Office.HostType.Excel) return;

    Excel.run(async (context) => {
        // Add change event handler
        context.workbook.worksheets.onChanged.add(handleExcelChange);
        await context.sync();
    }).catch(error => {
        console.error('Excel listener setup error:', error);
    });
}

/**
 * Handle Excel worksheet changes
 * @param {Excel.WorksheetChangedEventArgs} event - Change event
 */
function handleExcelChange(event) {
    console.log('Excel change detected:', event.changeType, event.address);
    
    // Notify other collaborators (would use SignalR or similar)
    notifyCollaborators({
        type: 'edit',
        location: event.address,
        changeType: event.changeType
    });
}

/**
 * Setup PowerPoint-specific change listeners
 */
function setupPowerPointListeners() {
    // PowerPoint API has limited change tracking
    console.log('PowerPoint listeners: Limited API support');
}

/**
 * Notify collaborators of changes (placeholder)
 * @param {object} change - Change notification
 */
function notifyCollaborators(change) {
    // TODO: Implement SignalR or WebSocket connection
    // For now, just log
    console.log('Would notify collaborators:', change);
}

/**
 * Render collaborators panel
 */
function renderCollaborators() {
    const panel = document.getElementById('collaboratorsPanel');
    if (!panel) return;

    if (collaborators.size === 0) {
        panel.innerHTML = `
            <div class="collaborators-empty">
                <p>No other collaborators right now</p>
            </div>
        `;
        return;
    }

    let html = '<div class="collaborators-list">';

    collaborators.forEach((collaborator, id) => {
        const presenceIcon = getPresenceIcon(collaborator.presence);
        const presenceColor = getPresenceColor(collaborator.presence);

        html += `
            <div class="collaborator-item">
                <div class="collaborator-avatar" style="border-color: ${presenceColor}">
                    ${presenceIcon}
                </div>
                <div class="collaborator-info">
                    <div class="collaborator-name">${collaborator.name}</div>
                    <div class="collaborator-status">${collaborator.activity || collaborator.presence}</div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    panel.innerHTML = html;
}

/**
 * Get presence icon
 * @param {string} availability - Availability status
 * @returns {string} Icon emoji
 */
function getPresenceIcon(availability) {
    const icons = {
        'Available': '🟢',
        'Busy': '🔴',
        'Away': '🟡',
        'BeRightBack': '🟡',
        'DoNotDisturb': '🔴',
        'Offline': '⚫',
        'Unknown': '⚪'
    };
    return icons[availability] || '⚪';
}

/**
 * Get presence color
 * @param {string} availability - Availability status
 * @returns {string} Color hex code
 */
function getPresenceColor(availability) {
    const colors = {
        'Available': '#34a853',
        'Busy': '#d93025',
        'Away': '#f9ab00',
        'BeRightBack': '#f9ab00',
        'DoNotDisturb': '#d93025',
        'Offline': '#666666',
        'Unknown': '#cccccc'
    };
    return colors[availability] || '#cccccc';
}

/**
 * Show live cursor positions (if supported)
 * @param {string} userId - User ID
 * @param {object} position - Cursor position
 */
function showCursorPosition(userId, position) {
    // TODO: Implement cursor position overlay
    // Office.js doesn't natively support this, would need custom implementation
    console.log(`User ${userId} cursor at:`, position);
}

/**
 * Cleanup on task pane close
 */
function cleanupCollaboration() {
    stopPresencePolling();
    collaborators.clear();
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCollaboration,
        cleanupCollaboration,
        renderCollaborators
    };
}
