/**
 * Enhanced UI Actions for Alex Office Add-in
 * Connects cognitive skills to Office.js operations via action buttons
 * 
 * This module extends taskpane.js with host-specific action buttons
 * that activate the operations defined in office-operations.js
 * 
 * Version: v5.7.7
 */

/**
 * Display host-specific action panel with cognitive skill buttons
 * @param {Office.HostType} host - Current Office host
 * @param {object} memoryContext - Loaded memory data
 */
async function displayActionPanel(host, memoryContext) {
    const content = document.getElementById('content');
    if (!content) return;

    const hasMemory = memoryContext && memoryContext.profile;

    let actionsHTML = '';

    switch (host) {
        case Office.HostType.Word:
            actionsHTML = `
                <div class="action-panel">
                    <h2>📝 Word Actions</h2>
                    <p>Activate cognitive skills to enhance your document</p>
                    
                    <div class="action-section">
                        <h3>🎯 Memory-Augmented Templates</h3>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="insertResearchSummary()" ${!hasMemory ? 'disabled' : ''}>
                                📄 Research Summary
                            </button>
                            <button class="btn btn-primary" onclick="insertMeetingNotes()" ${!hasMemory ? 'disabled' : ''}>
                                📋 Meeting Notes
                            </button>
                            <button class="btn btn-primary" onclick="insertArticle()" ${!hasMemory ? 'disabled' : ''}>
                                ✍️ Article Template
                            </button>
                        </div>
                    </div>
                    
                    <div class="action-section">
                        <h3>📊 Visual Integration</h3>
                        <p class="skill-connection">🔗 Activates: <code>markdown-mermaid (0.9)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="insertMermaidDiagram()">
                                📐 Insert Mermaid Diagram
                            </button>
                            <button class="btn btn-secondary" onclick="insertSVGGraphic()">
                                🎨 Insert SVG Graphic
                            </button>
                        </div>
                    </div>
                    
                    ${!hasMemory ? `
                    <div class="warning-message">
                        ⚠️ Memory-augmented templates require OneDrive setup. <a href="#" onclick="showMemorySetup(); return false;">Setup now</a>
                    </div>
                    ` : ''}
                </div>
            `;
            break;

        case Office.HostType.Excel:
            actionsHTML = `
                <div class="action-panel">
                    <h2>📊 Excel Actions</h2>
                    <p>Track and visualize your learning journey</p>
                    
                    <div class="action-section">
                        <h3>🎯 Learning Goals Tracker</h3>
                        <p class="skill-connection">🔗 Activates: <code>persona-detection (0.6)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="createGoalsTracker()" ${!hasMemory ? 'disabled' : ''}>
                                📋 Create Goals Tracker
                            </button>
                            <button class="btn btn-secondary" onclick="createSkillChart()">
                                📈 Create Skill Chart
                            </button>
                        </div>
                    </div>
                    
                    <div class="action-section">
                        <h3>🔬 Test Matrix</h3>
                        <p class="skill-connection">🔗 Activates: <code>testing-strategies (0.7)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="createTestMatrix()">
                                🧪 Generate Test Matrix
                            </button>
                        </div>
                    </div>
                    
                    ${!hasMemory ? `
                    <div class="warning-message">
                        ⚠️ Goals tracker requires focus-trifectas.md. <a href="#" onclick="showMemorySetup(); return false;">Setup now</a>
                    </div>
                    ` : ''}
                </div>
            `;
            break;

        case Office.HostType.PowerPoint:
            actionsHTML = `
                <div class="action-panel">
                    <h2>🎨 PowerPoint Actions</h2>
                    <p>Create visual presentations from your cognitive context</p>
                    
                    <div class="action-section">
                        <h3>🎯 Focus Trifecta Slides</h3>
                        <p class="skill-connection">🔗 Activates: <code>persona-detection (0.7)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="createTrifectaSlide()" ${!hasMemory ? 'disabled' : ''}>
                                🎯 Generate Trifecta Slide
                            </button>
                            <button class="btn btn-secondary" onclick="createArchitectureDiagram()">
                                📐 Architecture Diagram
                            </button>
                        </div>
                    </div>
                    
                    <div class="action-section">
                        <h3>✨ Animations (Phase 3)</h3>
                        <p class="skill-connection">🔗 Activates: <code>ui-ux-design (0.75)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="applySlideAnimations()">
                                🎬 Apply Entrance Animations
                            </button>
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">
                            Auto-apply fade/fly-in effects to current slide shapes
                        </p>
                    </div>
                    
                    <div class="action-section">
                        <h3>🎨 Brand Assets</h3>
                        <p class="skill-connection">🔗 Activates: <code>brand-asset-management (0.85)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="insertAlexLogo()">
                                🅰️ Insert Alex Logo
                            </button>
                            <button class="btn btn-secondary" onclick="applyAlexTheme()">
                                🎨 Apply Alex Theme
                            </button>
                        </div>
                    </div>
                    
                    ${!hasMemory ? `
                    <div class="warning-message">
                        ⚠️ Trifecta slides require focus-trifectas.md. <a href="#" onclick="showMemorySetup(); return false;">Setup now</a>
                    </div>
                    ` : ''}
                </div>
            `;
            break;

        case Office.HostType.Outlook:
            actionsHTML = `
                <div class="action-panel">
                    <h2>✉️ Outlook Actions</h2>
                    <p>Draft emails with memory-augmented context</p>
                    
                    <div class="action-section">
                        <h3>📧 Email Templates</h3>
                        <p class="skill-connection">🔗 Activates: <code>persona-detection (0.75)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="draftResponseEmail()" ${!hasMemory ? 'disabled' : ''}>
                                ↩️ Draft Response
                            </button>
                            <button class="btn btn-primary" onclick="draftFollowUpEmail()" ${!hasMemory ? 'disabled' : ''}>
                                📬 Draft Follow-up
                            </button>
                            <button class="btn btn-primary" onclick="draftIntroductionEmail()" ${!hasMemory ? 'disabled' : ''}>
                                👋 Draft Introduction
                            </button>
                        </div>
                    </div>
                    
                    <div class="action-section">
                        <h3>✨ Smart Replies (Phase 3)</h3>
                        <p class="skill-connection">🔗 Activates: <code>writing-publication (0.6)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="generateSmartReplies()" ${!hasMemory ? 'disabled' : ''}>
                                🧠 Generate Smart Replies
                            </button>
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">
                            Get 3 reply options (Professional, Casual, Brief) with sentiment analysis
                        </p>
                    </div>
                    
                    <div class="action-section">
                        <h3>📅 Calendar Integration (Phase 3)</h3>
                        <p class="skill-connection">🔗 Activates: <code>persona-detection (0.75)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" onclick="createMeetingFromEmail()">
                                📅 Create Meeting from Email
                            </button>
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">
                            Auto-extract date/time and create calendar appointment
                        </p>
                    </div>
                    
                    <div class="action-section">
                        <h3>⚡ Urgent Triage</h3>
                        <p class="skill-connection">🔗 Activates: <code>incident-response (0.8)</code></p>
                        <div class="action-buttons">
                            <button class="btn btn-danger" onclick="insertUrgentMarker()">
                                ⚠️ Mark URGENT
                            </button>
                            <button class="btn btn-danger" onclick="insertCriticalMarker()">
                                🚨 Mark CRITICAL
                            </button>
                        </div>
                    </div>
                    
                    ${!hasMemory ? `
                    <div class="warning-message">
                        ⚠️ Memory-augmented emails require profile.md. <a href="#" onclick="showMemorySetup(); return false;">Setup now</a>
                    </div>
                    ` : ''}
                </div>
            `;
            break;

        default:
            actionsHTML = `
                <div class="action-panel">
                    <h2>🚀 Alex Actions</h2>
                    <p>Host-specific actions will appear here</p>
                </div>
            `;
    }

    content.innerHTML = actionsHTML;
}

/******************************************************************************
 * WORD ACTION HANDLERS
 ******************************************************************************/

async function insertResearchSummary() {
    showLoading('Generating research summary...');
    const memory = await loadAlexMemory();
    const result = await wordInsertFromTemplate('research-summary', memory);
    showResult(result);
}

async function insertMeetingNotes() {
    showLoading('Generating meeting notes template...');
    const memory = await loadAlexMemory();
    const result = await wordInsertFromTemplate('meeting-notes', memory);
    showResult(result);
}

async function insertArticle() {
    showLoading('Generating article template...');
    const memory = await loadAlexMemory();
    const result = await wordInsertFromTemplate('article', memory);
    showResult(result);
}

async function insertMermaidDiagram() {
    // Prompt user for Mermaid code
    const mermaidCode = prompt('Enter Mermaid diagram code:', 
        'graph TD\n    A[Start] --> B[Process]\n    B --> C[End]'
    );
    
    if (mermaidCode) {
        showLoading('Inserting diagram...');
        const result = await wordInsertMermaidDiagram(mermaidCode);
        showResult(result);
    }
}

async function insertSVGGraphic() {
    alert('SVG insertion coming soon! For now, use the Mermaid diagram option.');
}

/******************************************************************************
 * EXCEL ACTION HANDLERS
 ******************************************************************************/

async function createGoalsTracker() {
    showLoading('Creating learning goals tracker...');
    const memory = await loadAlexMemory();
    const result = await excelCreateGoalsTracker(memory.focusTrifectas);
    showResult(result);
}

async function createSkillChart() {
    showLoading('Creating skill development chart...');
    const result = await excelCreateSkillChart();
    showResult(result);
}

async function createTestMatrix() {
    alert('Test matrix generation coming soon!');
}

/******************************************************************************
 * POWERPOINT ACTION HANDLERS
 ******************************************************************************/

async function createTrifectaSlide() {
    showLoading('Generating focus trifecta slide...');
    const memory = await loadAlexMemory();
    const result = await powerpointCreateTrifectaSlide(memory.focusTrifectas);
    showResult(result);
}

async function createArchitectureDiagram() {
    alert('Architecture diagram generation coming soon!');
}

async function insertAlexLogo() {
    alert('Alex logo insertion coming soon!');
}

async function applyAlexTheme() {
    alert('Alex theme application coming soon!');
}

/******************************************************************************
 * OUTLOOK ACTION HANDLERS
 ******************************************************************************/

async function draftResponseEmail() {
    showLoading('Drafting response email...');
    const memory = await loadAlexMemory();
    const result = await outlookDraftEmail(memory, 'response');
    showResult(result);
}

async function draftFollowUpEmail() {
    showLoading('Drafting follow-up email...');
    const memory = await loadAlexMemory();
    const result = await outlookDraftEmail(memory, 'follow-up');
    showResult(result);
}

async function draftIntroductionEmail() {
    showLoading('Drafting introduction email...');
    const memory = await loadAlexMemory();
    const result = await outlookDraftEmail(memory, 'introduction');
    showResult(result);
}

async function insertUrgentMarker() {
    const result = await outlookInsertUrgentMarker('URGENT');
    showResult(result);
}

async function insertCriticalMarker() {
    const result = await outlookInsertUrgentMarker('CRITICAL');
    showResult(result);
}

/******************************************************************************
 * PHASE 3 ADVANCED FEATURES (v5.7.7+)
 ******************************************************************************/

/**
 * Show Custom Functions Help - Display usage examples for Excel custom functions
 */
async function showCustomFunctionsHelp() {
    const content = document.getElementById('content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="action-panel">
            <h2>🧮 Excel Custom Functions</h2>
            <p>Use these formulas in any Excel cell to query your Alex cognitive memory:</p>
            
            <div class="action-section">
                <h3>📊 Available Functions</h3>
                
                <div style="background: #f5f5f5; padding: 12px; margin: 10px 0; border-radius: 4px;">
                    <code>=ALEX.SKILLLEVEL("React")</code>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        Returns your current skill level from focus-trifectas.md
                    </p>
                </div>
                
                <div style="background: #f5f5f5; padding: 12px; margin: 10px 0; border-radius: 4px;">
                    <code>=ALEX.GOALSTATUS("TypeScript")</code>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        Returns progress percentage (0.0 to 1.0) for a skill
                    </p>
                </div>
                
                <div style="background: #f5f5f5; padding: 12px; margin: 10px 0; border-radius: 4px;">
                    <code>=ALEX.NEXTSTEP("Python")</code>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        Returns the next action for a learning goal
                    </p>
                </div>
                
                <div style="background: #f5f5f5; padding: 12px; margin: 10px 0; border-radius: 4px;">
                    <code>=ALEX.MEMORYQUERY("current focus")</code>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        Natural language queries: "my name", "my role", "current goals"
                    </p>
                </div>
                
                <div class="action-buttons" style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="location.reload()">
                        🔄 Back to Actions
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Apply Slide Animations - Auto-apply entrance animations to PowerPoint shapes
 */
async function applySlideAnimations() {
    showLoading('Applying entrance animations to slide shapes...');
    
    try {
        const { powerpointApplyAnimations } = await import('./office-operations.js');
        const result = await powerpointApplyAnimations('fade');
        showResult(result);
    } catch (error) {
        showResult({
            success: false,
            message: `Animation error: ${error.message}`
        });
    }
}

/**
 * Generate Smart Replies - Create sentiment-aware email responses
 */
async function generateSmartReplies() {
    showLoading('Analyzing email sentiment and generating smart replies...');
    
    try {
        const { outlookGenerateSmartReplies, loadAlexMemory } = await import('./office-operations.js');
        
        // Get current email content
        const item = Office.context.mailbox.item;
        if (!item) {
            throw new Error('No email item selected');
        }
        
        // Get email body
        item.body.getAsync(Office.CoercionType.Text, async (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const emailContent = result.value;
                const memory = await loadAlexMemory();
                
                const replies = await outlookGenerateSmartReplies(emailContent, memory);
                
                // Display replies in a selector UI
                const content = document.getElementById('content');
                if (!content) return;
                
                content.innerHTML = `
                    <div class="action-panel">
                        <h2>🧠 Smart Replies Generated</h2>
                        <p>Choose a reply style based on email sentiment:</p>
                        
                        ${replies.map((reply, idx) => `
                            <div class="action-section">
                                <h3>${idx === 0 ? '💼' : idx === 1 ? '😊' : '⚡'} ${reply.tone}</h3>
                                <div style="background: #f5f5f5; padding: 12px; margin: 10px 0; border-radius: 4px; font-family: monospace; font-size: 12px; white-space: pre-wrap;">
${reply.content}
                                </div>
                                <button class="btn btn-primary" onclick="insertReply(${idx})">
                                    ✅ Use This Reply
                                </button>
                            </div>
                        `).join('')}
                        
                        <div class="action-buttons" style="margin-top: 20px;">
                            <button class="btn btn-secondary" onclick="location.reload()">
                                🔄 Back to Actions
                            </button>
                        </div>
                    </div>
                `;
                
                // Store replies for insertion
                window.smartReplies = replies;
                
                // Define insertReply handler
                window.insertReply = async (index) => {
                    const selectedReply = window.smartReplies[index];
                    item.body.setSelectedDataAsync(
                        selectedReply.content,
                        { coercionType: Office.CoercionType.Html },
                        (asyncResult) => {
                            if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                                showResult({
                                    success: true,
                                    message: `${selectedReply.tone} reply inserted successfully!`
                                });
                            } else {
                                showResult({
                                    success: false,
                                    message: `Failed to insert reply: ${asyncResult.error.message}`
                                });
                            }
                        }
                    );
                };
                
            } else {
                throw new Error(result.error.message);
            }
        });
        
    } catch (error) {
        showResult({
            success: false,
            message: `Smart replies error: ${error.message}`
        });
    }
}

/**
 * Create Meeting from Email - Parse email content and create calendar appointment
 */
async function createMeetingFromEmail() {
    showLoading('Parsing email for meeting details...');
    
    try {
        const { outlookCreateMeetingFromEmail } = await import('./office-operations.js');
        
        // Get current email content
        const item = Office.context.mailbox.item;
        if (!item) {
            throw new Error('No email item selected');
        }
        
        // Get email body
        item.body.getAsync(Office.CoercionType.Text, async (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const emailContent = result.value;
                const appointmentResult = await outlookCreateMeetingFromEmail(emailContent);
                
                if (appointmentResult.success && appointmentResult.url) {
                    // Show parsed details and open appointment creation
                    const content = document.getElementById('content');
                    if (!content) return;
                    
                    content.innerHTML = `
                        <div class="action-panel">
                            <h2>📅 Meeting Details Parsed</h2>
                            <p>Alex extracted the following meeting details:</p>
                            
                            <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 4px;">
                                <p><strong>Subject:</strong> ${appointmentResult.subject || 'N/A'}</p>
                                <p><strong>Date:</strong> ${appointmentResult.date || 'Not found'}</p>
                                <p><strong>Time:</strong> ${appointmentResult.time || 'Not found'}</p>
                                <p><strong>Location:</strong> ${appointmentResult.location || 'N/A'}</p>
                            </div>
                            
                            <div class="action-buttons">
                                <button class="btn btn-primary" onclick="window.open('${appointmentResult.url}', '_blank')">
                                    📅 Create Appointment in Outlook
                                </button>
                                <button class="btn btn-secondary" onclick="location.reload()">
                                    🔄 Back to Actions
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    showResult(appointmentResult);
                }
            } else {
                throw new Error(result.error.message);
            }
        });
        
    } catch (error) {
        showResult({
            success: false,
            message: `Meeting creation error: ${error.message}`
        });
    }
}

/******************************************************************************
 * UI FEEDBACK UTILITIES
 ******************************************************************************/

function showLoading(message) {
    const content = document.getElementById('content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

function showResult(result) {
    const content = document.getElementById('content');
    if (!content) return;
    
    if (result.success) {
        content.innerHTML = `
            <div class="success-message">
                <strong>✅ Success</strong>
                <p>${result.message}</p>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="location.reload()">
                        🔄 Show Actions
                    </button>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="error-message">
                <strong>⚠️ Error</strong>
                <p>${result.message}</p>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="location.reload()">
                        🔄 Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Make action handlers available globally
window.displayActionPanel = displayActionPanel;
window.insertResearchSummary = insertResearchSummary;
window.insertMeetingNotes = insertMeetingNotes;
window.insertArticle = insertArticle;
window.insertMermaidDiagram = insertMermaidDiagram;
window.insertSVGGraphic = insertSVGGraphic;
window.createGoalsTracker = createGoalsTracker;
window.createSkillChart = createSkillChart;
window.createTestMatrix = createTestMatrix;
window.createTrifectaSlide = createTrifectaSlide;
window.createArchitectureDiagram = createArchitectureDiagram;
window.insertAlexLogo = insertAlexLogo;
window.applyAlexTheme = applyAlexTheme;
window.draftResponseEmail = draftResponseEmail;
window.draftFollowUpEmail = draftFollowUpEmail;
window.draftIntroductionEmail = draftIntroductionEmail;
window.insertUrgentMarker = insertUrgentMarker;
window.insertCriticalMarker = insertCriticalMarker;

// Phase 3 Advanced Features (v5.7.7+)
window.showCustomFunctionsHelp = showCustomFunctionsHelp;
window.applySlideAnimations = applySlideAnimations;
window.generateSmartReplies = generateSmartReplies;
window.createMeetingFromEmail = createMeetingFromEmail;
