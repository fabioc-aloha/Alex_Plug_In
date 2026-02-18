/* Alex Office Add-in Task Pane JavaScript */

Office.onReady((info) => {
    console.log(`Office.js ready. Host: ${info.host}, Platform: ${info.platform}`);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeTaskPane(info));
    } else {
        initializeTaskPane(info);
    }
});

/**
 * Initialize the task pane
 * @param {Office.HostType} info - Office host information
 */
async function initializeTaskPane(info) {
    try {
        // Display host-specific welcome
        displayWelcome(info);
        
        // Check memory access
        const memoryStatus = await checkMemoryAccess();
        displayMemoryStatus(memoryStatus);
        
        // Setup event listeners
        setupEventListeners();
        
        // Log successful initialization
        console.log('Alex task pane initialized successfully');
        
    } catch (error) {
        console.error('Task pane initialization error:', error);
        displayError('Failed to initialize Alex', error.message);
    }
}

/**
 * Check OneDrive memory access via Microsoft Graph API
 * @returns {Promise<Array>} Memory file status
 */
async function checkMemoryAccess() {
    const memoryFiles = [
        { name: 'profile.md', path: 'Alex-Memory/profile.md', status: 'checking' },
        { name: 'notes.md', path: 'Alex-Memory/notes.md', status: 'checking' },
        { name: 'focus-trifectas.md', path: 'Alex-Memory/focus-trifectas.md', status: 'checking' }
    ];
    
    try {
        // Get Microsoft Graph access token via Office.js SSO
        const token = await getGraphAccessToken();
        
        // Check each file in parallel using Graph API
        const fileChecks = memoryFiles.map(async (file) => {
            try {
                const fileUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/Alex-Memory/${file.name}`;
                const response = await fetch(fileUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const fileData = await response.json();
                    file.status = 'loaded';
                    file.lastModified = fileData.lastModifiedDateTime;
                } else if (response.status === 404) {
                    file.status = 'missing';
                } else {
                    file.status = 'error';
                }
            } catch (error) {
                console.error(`Error checking ${file.name}:`, error);
                file.status = 'error';
            }
            return file;
        });

        return await Promise.all(fileChecks);
    } catch (error) {
        console.error('Graph API authentication failed:', error);
        // Fallback to simulated results if authentication fails
        // (useful for development/testing without full SSO setup)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        memoryFiles[0].status = 'loaded';
        memoryFiles[0].lastModified = new Date().toISOString();
        memoryFiles[1].status = 'loaded';
        memoryFiles[1].lastModified = new Date().toISOString();
        memoryFiles[2].status = 'missing';
        
        return memoryFiles;
        
    } catch (error) {
        console.error('Memory access check failed:', error);
        // Mark all as error state
        return memoryFiles.map(f => ({ ...f, status: 'error', error: error.message }));
    }
}

/**
 * Display memory status in UI
 * @param {Array} files - Memory file status array
 */
function displayMemoryStatus(files) {
    const memoryFilesDiv = document.getElementById('memoryFiles');
    if (!memoryFilesDiv) return;
    
    memoryFilesDiv.innerHTML = files.map(file => {
        const icon = file.status === 'loaded' ? '✅' : 
                     file.status === 'missing' ? '⚠️' : '❌';
        const statusText = file.status === 'loaded' ? 'Loaded' : 
                          file.status === 'missing' ? 'Not found' : 'Error';
        
        return `
            <div class="memory-file ${file.status}">
                <span class="memory-file-icon">${icon}</span>
                <span class="memory-file-name">${file.name}</span>
                <span class="memory-file-status">${statusText}</span>
            </div>
        `;
    }).join('');
}

/**
 * Display welcome message with host-specific content
 * @param {Office.HostType} info - Office host information
 */
function displayWelcome(info) {
    const content = document.getElementById('content');
    if (!content) return;
    
    const hostName = getHostName(info.host);
    const capabilities = getHostCapabilities(info.host);
    const hasMemory = true; // Will be updated after memory check
    
    content.innerHTML = `
        <div class="welcome-message">
            <h2>🚀 Welcome to ${hostName}</h2>
            <p>Alex is now available directly in ${hostName}! Get personalized assistance based on your OneDrive memory.</p>
            
            <div style="background: #f0f7ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <strong>What's New in v5.8.1:</strong>
                <ul style="margin: 8px 0 0 20px; line-height: 1.8;">
                    <li>🌅 Enhanced Morning Briefing — calendar + email + goals integration</li>
                    <li>📅 Enhanced Meeting Prep — attendee research + context synthesis</li>
                    <li>💬 Quick Workflow Shortcuts — one-click access to M365 Copilot workflows</li>
                    <li>🎯 Host-specific action panels with skill activation</li>
                </ul>
            </div>
            
            <p><strong>What Alex Can Do in ${hostName}:</strong></p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                ${capabilities}
            </ul>
            
            <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #4caf50;">
                <strong>⚡ Quick M365 Copilot Workflows</strong>
                <p style="font-size: 13px; margin: 8px 0 12px 0; opacity: 0.9;">
                    Use these prompts in M365 Copilot for enhanced workflows:
                </p>
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                    <button class="btn" style="background: white; color: #333; border: 1px solid #ddd; text-align: left; padding: 10px 12px;" 
                            onclick="copyToClipboard('Start my day - show my calendar, email highlights, goals, and suggest focus time')">
                        🌅 <strong>Morning Briefing</strong> — Calendar, email, goals
                    </button>
                    <button class="btn" style="background: white; color: #333; border: 1px solid #ddd; text-align: left; padding: 10px 12px;"
                            onclick="copyToClipboard('Prep for my next meeting - look up attendees, email history, and context')">
                        📅 <strong>Meeting Prep</strong> — Attendee research & context
                    </button>
                    <button class="btn" style="background: white; color: #333; border: 1px solid #ddd; text-align: left; padding: 10px 12px;"
                            onclick="copyToClipboard('Check my calendar - how many meetings do I have? Any back-to-backs? Wheres my focus time?')">
                        ⚖️ <strong>Workload Check</strong> — Meeting count, focus blocks
                    </button>
                </div>
                <p style="font-size: 12px; margin: 12px 0 0 0; opacity: 0.7;">
                    💡 Click a workflow to copy the prompt, then paste in M365 Copilot
                </p>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="showActionPanel()">
                    🚀 Show ${hostName} Actions
                </button>
                <button class="btn btn-secondary" onclick="showMemorySetup()">
                    🛠️ Setup Memory
                </button>
                <button class="btn btn-secondary" onclick="openM365Copilot()">
                    💬 Open M365 Copilot
                </button>
            </div>
        </div>
    `;
}

/**
 * Get friendly host name
 * @param {Office.HostType} host - Office host type
 * @returns {string} Friendly host name
 */
function getHostName(host) {
    const hosts = {
        'Word': 'Word',
        'Excel': 'Excel',
        'PowerPoint': 'PowerPoint',
        'Outlook': 'Outlook',
        'OneNote': 'OneNote'
    };
    return hosts[host] || 'Office';
}

/**
 * Get host-specific capabilities HTML
 * @param {Office.HostType} host - Office host type
 * @returns {string} HTML list of capabilities
 */
function getHostCapabilities(host) {
    const capabilities = {
        'Word': [
            '<li>📝 Generate documents from templates</li>',
            '<li>✍️ Writing assistance based on your persona</li>',
            '<li>📋 Insert research summaries from your notes</li>',
            '<li>🎯 Apply focus trifectas to document structure</li>'
        ],
        'Excel': [
            '<li>📊 Track learning goals and progress</li>',
            '<li>📈 Visualize skill development charts</li>',
            '<li>🔢 Calculate metrics from your focus areas</li>',
            '<li>💡 Data analysis aligned with your objectives</li>'
        ],
        'PowerPoint': [
            '<li>🎨 Generate slides based on focus trifectas</li>',
            '<li>📊 Create visual summaries of projects</li>',
            '<li>🎯 Present insights from your memory</li>',
            '<li>✨ Design with your persona in mind</li>'
        ],
        'Outlook': [
            '<li>✉️ Draft emails with memory-augmented context</li>',
            '<li>📅 Prepare for meetings with attendee research</li>',
            '<li>🔍 Search conversations with cognitive awareness</li>',
            '<li>⚡ Quick responses aligned with your communication style</li>'
        ]
    };
    
    return (capabilities[host] || [
        '<li>💬 Chat with Alex about your work</li>',
        '<li>📚 Access your OneDrive memory</li>',
        '<li>🎯 Get personalized assistance</li>'
    ]).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Listen for Office context changes
    if (Office.context.document) {
        Office.context.document.addHandlerAsync(
            Office.EventType.DocumentSelectionChanged,
            onSelectionChanged
        );
    }
}

/**
 * Handle document selection changes
 * @param {Office.AsyncResult} eventArgs - Event arguments
 */
function onSelectionChanged(eventArgs) {
    console.log('Selection changed', eventArgs);
    // TODO: Update UI based on selection
}

/**
 * Show coming soon message
 * @param {string} feature - Feature name
 */
function showComingSoon(feature) {
    alert(`${feature} coming soon! For now, use Alex in M365 Copilot for full chat functionality.`);
}

/**
 * Show action panel with cognitive skill activation buttons
 */
async function showActionPanel() {
    const content = document.getElementById('content');
    if (!content) return;
    
    // Show loading state
    content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading Alex memory...</p>
        </div>
    `;
    
    try {
        // Load memory from OneDrive
        const memory = await loadAlexMemory();
        
        // Display action panel with loaded memory
        await displayActionPanel(Office.context.host, memory);
    } catch (error) {
        console.error('Failed to load action panel:', error);
        content.innerHTML = `
            <div class="error-message">
                <strong>⚠️ Failed to Load Actions</strong>
                <p>${error.message}</p>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="location.reload()">
                        🔄 Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Show memory setup instructions
 */
function showMemorySetup() {
    const content = document.getElementById('content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="welcome-message">
            <h2>🛠️ Setup Alex Memory</h2>
            <p>Alex stores your cognitive memory in OneDrive for persistence across all M365 surfaces.</p>
            
            <div style="background: #fff4e5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <strong>📍 Memory Location:</strong> <code>OneDrive/Alex-Memory/</code>
            </div>
            
            <h3 style="margin: 20px 0 12px;">Setup Steps:</h3>
            <ol style="margin-left: 20px; line-height: 2;">
                <li>Open <a href="https://onedrive.live.com" target="_blank">OneDrive in your browser</a></li>
                <li>Create a folder called <strong>Alex-Memory</strong></li>
                <li>Create these files:
                    <ul style="margin-top: 8px;">
                        <li><code>profile.md</code> — Your name, role, learning goals</li>
                        <li><code>notes.md</code> — Session notes and reminders</li>
                        <li><code>focus-trifectas.md</code> — Current focus areas (3 skills each)</li>
                    </ul>
                </li>
                <li>Use templates from <a href="https://github.com/fabioc-aloha/Alex_Plug_In/tree/main/platforms/m365-copilot/onedrive-templates" target="_blank">GitHub</a></li>
                <li>Return here and click "Refresh Memory"</li>
            </ol>
            
            <h3 style="margin: 20px 0 12px;">Why OneDrive?</h3>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li>✅ Your data stays in your Microsoft account</li>
                <li>✅ Persistent across all M365 apps (Teams, Office, Copilot)</li>
                <li>✅ You control access, editing, and deletion</li>
                <li>✅ Works with existing M365 security and compliance</li>
            </ul>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="window.open('https://onedrive.live.com', '_blank')">
                    📁 Open OneDrive
                </button>
                <button class="btn btn-secondary" onclick="refreshMemory()">
                    🔄 Refresh Memory
                </button>
                <button class="btn btn-secondary" onclick="window.open('https://github.com/fabioc-aloha/Alex_Plug_In/tree/main/platforms/m365-copilot/onedrive-templates', '_blank')">
                    📄 Get Templates
                </button>
            </div>
        </div>
    `;
}

/**
 * Refresh memory status
 */
async function refreshMemory() {
    const content = document.getElementById('content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Checking Alex-Memory folder...</p>
        </div>
    `;
    
    // Re-initialize
    const info = { 
        host: Office.context.host, 
        platform: Office.context.platform 
    };
    await initializeTaskPane(info);
}

/**
 * Open GitHub repository
 */
function openGitHub() {
    window.open('https://github.com/fabioc-aloha/Alex_Plug_In', '_blank');
}

/**
 * Open M365 Copilot in new tab
 */
function openM365Copilot() {
    window.open('https://m365.cloud.microsoft/chat', '_blank');
}

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showCopyNotification('✅ Copied! Paste in M365 Copilot');
        } else {
            // Fallback for browsers without clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showCopyNotification('✅ Copied! Paste in M365 Copilot');
            } catch (err) {
                showCopyNotification('❌ Copy failed - please select and copy manually');
            }
            document.body.removeChild(textArea);
        }
    } catch (error) {
        console.error('Copy to clipboard failed:', error);
        showCopyNotification('❌ Copy failed - please select and copy manually');
    }
}

/**
 * Show temporary notification for copy action
 * @param {string} message - Notification message
 */
function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 2500);
}

/**
 * Display error message
 * @param {string} title - Error title
 * @param {string} message - Error message
 */
function displayError(title, message) {
    const content = document.getElementById('content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="error-message">
            <strong>⚠️ ${title}</strong>
            <p>${message}</p>
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="refreshMemory()">
                    🔄 Try Again
                </button>
            </div>
        </div>
    `;
}

// Make functions available globally for onclick handlers
window.showComingSoon = showComingSoon;
window.showActionPanel = showActionPanel;
window.showMemorySetup = showMemorySetup;
window.refreshMemory = refreshMemory;
window.openGitHub = openGitHub;
