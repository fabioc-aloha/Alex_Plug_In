/**
 * Office.js API Operations for Alex Cognitive Architecture
 * 
 * This module provides concrete implementations of document manipulation
 * functions aligned with the cognitive integration skills defined in
 * .github/skills/ (office-document-integration, word-integration, 
 * excel-integration, powerpoint-integration, outlook-integration).
 * 
 * Each function connects to synaptic pathways enabling cross-platform
 * skill activation (e.g., markdown-mermaid → Word diagram insertion).
 * 
 * Version: v5.7.7
 * Synapse Schema: v2.0.0
 */

/******************************************************************************
 * WORD INTEGRATION OPERATIONS
 * Aligned with: .github/skills/word-integration/SKILL.md
 * Synapses: 5 connections (markdown-mermaid, writing-publication, etc.)
 ******************************************************************************/

/**
 * Insert text content at cursor position in Word
 * @param {string} text - Text content to insert
 * @param {string} style - Paragraph style (e.g., 'Normal', 'Heading1', 'Quote')
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function wordInsertText(text, style = 'Normal') {
    if (Office.context.host !== Office.HostType.Word) {
        return { success: false, message: 'This operation requires Word' };
    }

    try {
        await Word.run(async (context) => {
            // Get current selection
            const selection = context.document.getSelection();
            
            // Insert paragraph at selection
            const paragraph = selection.insertParagraph(text, Word.InsertLocation.end);
            paragraph.style = style;
            
            await context.sync();
        });

        return { success: true, message: `Inserted text with style: ${style}` };
    } catch (error) {
        console.error('Word insert text error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Insert Mermaid diagram as SVG in Word document
 * Activates synapse: markdown-mermaid (0.9) → Word
 * @param {string} mermaidCode - Mermaid diagram definition
 * @param {number} width - Image width in points
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function wordInsertMermaidDiagram(mermaidCode, width = 400) {
    if (Office.context.host !== Office.HostType.Word) {
        return { success: false, message: 'This operation requires Word' };
    }

    try {
        // TODO: Convert Mermaid to SVG using mermaid.js library
        // For now, insert as code block with instructions
        const placeholder = `\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n\n[Note: SVG rendering coming soon]`;
        
        await Word.run(async (context) => {
            const selection = context.document.getSelection();
            const paragraph = selection.insertParagraph(placeholder, Word.InsertLocation.end);
            paragraph.font.name = 'Consolas';
            paragraph.font.size = 10;
            
            await context.sync();
        });

        return { success: true, message: 'Inserted Mermaid diagram (placeholder)' };
    } catch (error) {
        console.error('Word insert diagram error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Insert document from memory template
 * Reads profile.md and applies persona-based template
 * Activates synapse: persona-detection (0.8) → Word
 * @param {string} templateType - Template type ('research-summary', 'meeting-notes', 'article')
 * @param {object} memoryContext - Memory data (profile, notes, focus)
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function wordInsertFromTemplate(templateType, memoryContext) {
    if (Office.context.host !== Office.HostType.Word) {
        return { success: false, message: 'This operation requires Word' };
    }

    try {
        const templates = {
            'research-summary': generateResearchSummaryTemplate(memoryContext),
            'meeting-notes': generateMeetingNotesTemplate(memoryContext),
            'article': generateArticleTemplate(memoryContext)
        };

        const content = templates[templateType] || templates['research-summary'];

        await Word.run(async (context) => {
            const body = context.document.body;
            
            // Clear existing content and insert template
            body.insertParagraph(content.title, Word.InsertLocation.start).style = 'Heading1';
            body.insertParagraph(content.subtitle, Word.InsertLocation.end).style = 'Subtitle';
            body.insertParagraph('', Word.InsertLocation.end); // Blank line
            
            content.sections.forEach(section => {
                body.insertParagraph(section.heading, Word.InsertLocation.end).style = 'Heading2';
                body.insertParagraph(section.content, Word.InsertLocation.end).style = 'Normal';
                body.insertParagraph('', Word.InsertLocation.end); // Blank line
            });
            
            await context.sync();
        });

        return { success: true, message: `Inserted ${templateType} template` };
    } catch (error) {
        console.error('Word template insertion error:', error);
        return { success: false, message: error.message };
    }
}

/******************************************************************************
 * EXCEL INTEGRATION OPERATIONS
 * Aligned with: .github/skills/excel-integration/SKILL.md
 * Synapses: 4 connections (testing-strategies, observability-monitoring, etc.)
 ******************************************************************************/

/**
 * Create learning goals tracking table in Excel
 * Activates synapse: persona-detection (0.6) → Excel
 * @param {object} focusTrifectas - Focus trifectas from memory
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function excelCreateGoalsTracker(focusTrifectas) {
    if (Office.context.host !== Office.HostType.Excel) {
        return { success: false, message: 'This operation requires Excel' };
    }

    try {
        await Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            
            // Create header row
            const headers = [['Skill', 'Current Level', 'Target Level', 'Progress %', 'Next Action']];
            const headerRange = sheet.getRange('A1:E1');
            headerRange.values = headers;
            headerRange.format.font.bold = true;
            headerRange.format.fill.color = '#0078D4'; // Alex blue
            headerRange.format.font.color = 'white';
            
            // Parse focus trifectas and populate rows
            const skills = parseFocusTrifectasToSkills(focusTrifectas);
            if (skills.length > 0) {
                const dataRange = sheet.getRange(`A2:E${skills.length + 1}`);
                dataRange.values = skills;
                
                // Add progress bar formatting
                const progressColumn = sheet.getRange(`D2:D${skills.length + 1}`);
                progressColumn.numberFormat = [['0%']];
                
                // Conditional formatting for progress
                const conditionalFormat = progressColumn.conditionalFormats.add(
                    Excel.ConditionalFormatType.dataBar
                );
                conditionalFormat.dataBar.barDirection = Excel.ConditionalDataBarDirection.leftToRight;
            }
            
            // Auto-fit columns
            sheet.getUsedRange().format.autofitColumns();
            sheet.getUsedRange().format.autofitRows();
            
            await context.sync();
        });

        return { success: true, message: 'Created learning goals tracker' };
    } catch (error) {
        console.error('Excel goals tracker error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Create skill development chart from tracking table
 * Activates synapse: observability-monitoring (0.65) → Excel
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function excelCreateSkillChart() {
    if (Office.context.host !== Office.HostType.Excel) {
        return { success: false, message: 'This operation requires Excel' };
    }

    try {
        await Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            
            // Get data range (assuming headers in row 1)
            const usedRange = sheet.getUsedRange();
            usedRange.load('rowCount');
            await context.sync();
            
            const dataRange = sheet.getRange(`A1:D${usedRange.rowCount}`);
            
            // Create chart
            const chart = sheet.charts.add(
                Excel.ChartType.columnClustered,
                dataRange,
                Excel.ChartSeriesBy.columns
            );
            
            chart.title.text = 'Skill Development Progress';
            chart.legend.position = Excel.ChartLegendPosition.bottom;
            chart.setPosition('G2'); // Position chart to the right
            chart.height = 300;
            chart.width = 500;
            
            await context.sync();
        });

        return { success: true, message: 'Created skill development chart' };
    } catch (error) {
        console.error('Excel chart creation error:', error);
        return { success: false, message: error.message };
    }
}

/******************************************************************************
 * POWERPOINT INTEGRATION OPERATIONS
 * Aligned with: .github/skills/powerpoint-integration/SKILL.md
 * Synapses: 6 connections (svg-graphics, markdown-mermaid, ui-ux-design, etc.)
 ******************************************************************************/

/**
 * Create focus trifecta presentation slide
 * Activates synapse: persona-detection (0.7) → PowerPoint
 * @param {object} focusTrifectas - Focus trifectas from memory
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function powerpointCreateTrifectaSlide(focusTrifectas) {
    if (Office.context.host !== Office.HostType.PowerPoint) {
        return { success: false, message: 'This operation requires PowerPoint' };
    }

    try {
        await PowerPoint.run(async (context) => {
            // Add new slide with blank layout
            const slides = context.presentation.slides;
            const newSlide = slides.add();
            
            // Add title
            const titleShape = newSlide.shapes.addTextBox('Focus Trifectas');
            titleShape.left = 50;
            titleShape.top = 30;
            titleShape.width = 600;
            titleShape.height = 60;
            titleShape.textFrame.textRange.font.size = 36;
            titleShape.textFrame.textRange.font.bold = true;
            titleShape.textFrame.textRange.font.color = '#0078D4'; // Alex blue
            
            // Parse and add trifectas
            const trifectaList = parseFocusTrifectasToList(focusTrifectas);
            
            let yPosition = 120;
            trifectaList.forEach((trifecta, index) => {
                const textBox = newSlide.shapes.addTextBox(
                    `${index + 1}. ${trifecta.name}\n   ${trifecta.skills.join(' • ')}`
                );
                textBox.left = 80;
                textBox.top = yPosition;
                textBox.width = 560;
                textBox.height = 80;
                textBox.textFrame.textRange.font.size = 18;
                
                yPosition += 100;
            });
            
            await context.sync();
        });

        return { success: true, message: 'Created focus trifecta slide' };
    } catch (error) {
        console.error('PowerPoint slide creation error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Insert SVG diagram on current slide
 * Activates synapse: svg-graphics (0.85) → PowerPoint
 * @param {string} svgContent - SVG XML content
 * @param {number} left - Left position in points
 * @param {number} top - Top position in points
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function powerpointInsertSVG(svgContent, left = 100, top = 150) {
    if (Office.context.host !== Office.HostType.PowerPoint) {
        return { success: false, message: 'This operation requires PowerPoint' };
    }

    try {
        // Convert SVG to Base64 PNG (Office.js doesn't support direct SVG insertion)
        // TODO: Implement SVG → PNG conversion
        // For now, insert placeholder
        
        await PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            slides.load('items');
            await context.sync();
            
            const currentSlide = slides.items[slides.items.length - 1];
            
            const placeholder = currentSlide.shapes.addTextBox(
                '[SVG Diagram]\n(Coming soon: Base64 PNG conversion)'
            );
            placeholder.left = left;
            placeholder.top = top;
            placeholder.width = 300;
            placeholder.height = 200;
            placeholder.textFrame.textRange.font.size = 14;
            placeholder.textFrame.textRange.font.color = '#666666';
            
            await context.sync();
        });

        return { success: true, message: 'Inserted SVG placeholder' };
    } catch (error) {
        console.error('PowerPoint SVG insertion error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Apply entrance animations to all shapes on current slide
 * Activates synapse: ui-ux-design (0.75) → PowerPoint
 * @param {string} animationType - Animation type ('fade', 'flyIn', 'wipe', 'zoom')
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function powerpointApplyAnimations(animationType = 'fade') {
    if (Office.context.host !== Office.HostType.PowerPoint) {
        return { success: false, message: 'This operation requires PowerPoint' };
    }

    try {
        await PowerPoint.run(async (context) => {
            const slides = context.presentation.slides;
            slides.load('items');
            await context.sync();
            
            const currentSlide = slides.items[slides.items.length - 1];
            const shapes = currentSlide.shapes;
            shapes.load('items');
            await context.sync();
            
            // Note: PowerPoint.js API doesn't currently support animations directly
            // This would require Office-js-helpers or OOXML manipulation
            // For now, we'll document the intention
            
            console.log(`Would apply ${animationType} animation to ${shapes.items.length} shapes`);
            
            await context.sync();
        });

        return { 
            success: true, 
            message: `Animation setup prepared (${animationType}). Note: PowerPoint.js API doesn't yet support direct animation control. Use PowerPoint UI to apply animations.` 
        };
    } catch (error) {
        console.error('PowerPoint animation error:', error);
        return { success: false, message: error.message };
    }
}

/******************************************************************************
 * OUTLOOK INTEGRATION OPERATIONS
 * Aligned with: .github/skills/outlook-integration/SKILL.md
 * Synapses: 4 connections (incident-response, persona-detection, etc.)
 ******************************************************************************/

/**
 * Draft email with memory-augmented context
 * Activates synapse: persona-detection (0.75) → Outlook
 * @param {object} memoryContext - Memory data (profile, notes)
 * @param {string} emailType - Email type ('response', 'follow-up', 'introduction')
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function outlookDraftEmail(memoryContext, emailType = 'response') {
    if (Office.context.host !== Office.HostType.Outlook) {
        return { success: false, message: 'This operation requires Outlook' };
    }

    try {
        const templates = {
            'response': generateEmailResponseTemplate(memoryContext),
            'follow-up': generateEmailFollowUpTemplate(memoryContext),
            'introduction': generateEmailIntroductionTemplate(memoryContext)
        };

        const emailContent = templates[emailType] || templates['response'];

        // Get current compose item
        const item = Office.context.mailbox.item;
        
        // Set subject (for new emails)
        if (item.itemType === Office.MailboxEnums.ItemType.Message && item.subject) {
            item.subject.setAsync(emailContent.subject);
        }

        // Insert email body
        item.body.setSelectedDataAsync(
            emailContent.body,
            { coercionType: Office.CoercionType.Html },
            (result) => {
                if (result.status === Office.AsyncResultStatus.Failed) {
                    console.error('Email draft failed:', result.error);
                }
            }
        );

        return { success: true, message: `Drafted ${emailType} email` };
    } catch (error) {
        console.error('Outlook draft email error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Insert urgent triage markers in email
 * Activates synapse: incident-response (0.8) → Outlook
 * @param {string} priority - Priority level ('URGENT', 'CRITICAL', 'NORMAL')
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function outlookInsertUrgentMarker(priority = 'URGENT') {
    if (Office.context.host !== Office.HostType.Outlook) {
        return { success: false, message: 'This operation requires Outlook' };
    }

    try {
        const markers = {
            'URGENT': '<p style="color: #d93025; font-weight: bold;">⚠️ URGENT — Immediate attention required</p>',
            'CRITICAL': '<p style="color: #d93025; font-weight: bold;">🚨 CRITICAL — System impact, respond ASAP</p>',
            'NORMAL': '<p style="color: #0078d4; font-weight: bold;">📌 Action Required</p>'
        };

        const markerHtml = markers[priority] || markers['NORMAL'];

        Office.context.mailbox.item.body.setSelectedDataAsync(
            markerHtml,
            { coercionType: Office.CoercionType.Html },
            (result) => {
                if (result.status === Office.AsyncResultStatus.Failed) {
                    console.error('Urgent marker insertion failed:', result.error);
                }
            }
        );

        return { success: true, message: `Inserted ${priority} marker` };
    } catch (error) {
        console.error('Outlook urgent marker error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Generate smart reply options with sentiment analysis
 * Activates synapse: writing-publication (0.6) → Outlook
 * @param {string} emailContent - Email content to analyze
 * @param {object} memoryContext - Memory data for personalization
 * @returns {Promise<{success: boolean, replies?: Array<{tone: string, content: string}>, message: string}>}
 */
async function outlookGenerateSmartReplies(emailContent, memoryContext) {
    if (Office.context.host !== Office.HostType.Outlook) {
        return { success: false, message: 'This operation requires Outlook' };
    }

    try {
        // Simple sentiment analysis (in production, would use NLP API)
        const sentiment = analyzeSentiment(emailContent);
        const userName = extractUserName(memoryContext.profile) || 'there';
        
        // Generate 3 reply options with different tones
        const replies = [
            {
                tone: 'Professional',
                content: generateProfessionalReply(emailContent, userName, sentiment)
            },
            {
                tone: 'Casual',
                content: generateCasualReply(emailContent, userName, sentiment)
            },
            {
                tone: 'Brief',
                content: generateBriefReply(emailContent, userName, sentiment)
            }
        ];

        return { success: true, replies, message: 'Generated 3 smart reply options' };
    } catch (error) {
        console.error('Outlook smart replies error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Create calendar appointment from email action items
 * Activates synapse: persona-detection (0.75) → Outlook
 * @param {string} emailContent - Email content to parse
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function outlookCreateMeetingFromEmail(emailContent) {
    if (Office.context.host !== Office.HostType.Outlook) {
        return { success: false, message: 'This operation requires Outlook' };
    }

    try {
        // Parse email for meeting details
        const meetingDetails = parseMeetingDetails(emailContent);
        
        if (!meetingDetails.hasValidDate) {
            return { 
                success: false, 
                message: 'No valid date/time found in email. Please specify a date.' 
            };
        }

        // Create appointment using EWS or Graph API
        // Note: Office.js doesn't have direct appointment creation
        // Would require EWS or Microsoft Graph API
        
        const appointmentUrl = createOutlookAppointmentUrl(meetingDetails);
        
        // For now, provide instructions
        return { 
            success: true, 
            message: `Meeting details extracted:\nSubject: ${meetingDetails.subject}\nDate: ${meetingDetails.date}\nClick to create: ${appointmentUrl}` 
        };
    } catch (error) {
        console.error('Outlook calendar creation error:', error);
        return { success: false, message: error.message };
    }
}

/******************************************************************************
 * MICROSOFT GRAPH API INTEGRATION
 * OneDrive memory access (profile.md, notes.md, focus-trifectas.md)
 ******************************************************************************/

/**
 * Get Microsoft Graph access token via Office.js SSO
 * @returns {Promise<string>} Access token
 */
async function getGraphAccessToken() {
    try {
        // Use Office.js SSO to get access token
        const token = await OfficeRuntime.auth.getAccessToken({
            allowSignInPrompt: true,
            allowConsentPrompt: true,
            forMSGraphAccess: true
        });
        
        return token;
    } catch (error) {
        console.error('Graph token acquisition failed:', error);
        throw new Error('Unable to authenticate with Microsoft Graph. Please sign in to Office.');
    }
}

/**
 * Read OneDrive memory file
 * @param {string} fileName - File name (e.g., 'profile.md')
 * @returns {Promise<{success: boolean, content?: string, error?: string}>}
 */
async function readOneDriveMemoryFile(fileName) {
    try {
        const token = await getGraphAccessToken();
        
        // Graph API endpoint for OneDrive file
        const fileUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/Alex-Memory/${fileName}:/content`;
        
        const response = await fetch(fileUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { success: false, error: 'File not found in Alex-Memory folder' };
            }
            throw new Error(`Graph API error: ${response.status} ${response.statusText}`);
        }

        const content = await response.text();
        return { success: true, content };
    } catch (error) {
        console.error('OneDrive read error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Load all Alex memory files from OneDrive
 * @returns {Promise<{profile: string, notes: string, focusTrifectas: string}>}
 */
async function loadAlexMemory() {
    const [profile, notes, focusTrifectas] = await Promise.all([
        readOneDriveMemoryFile('profile.md'),
        readOneDriveMemoryFile('notes.md'),
        readOneDriveMemoryFile('focus-trifectas.md')
    ]);

    return {
        profile: profile.success ? profile.content : '',
        notes: notes.success ? notes.content : '',
        focusTrifectas: focusTrifectas.success ? focusTrifectas.content : ''
    };
}

/******************************************************************************
 * TEMPLATE GENERATORS
 * Memory-augmented content generation
 ******************************************************************************/

function generateResearchSummaryTemplate(memoryContext) {
    const userName = extractUserName(memoryContext.profile) || 'Researcher';
    
    return {
        title: 'Research Summary',
        subtitle: `Prepared by ${userName} • ${new Date().toLocaleDateString()}`,
        sections: [
            {
                heading: 'Research Question',
                content: '[State your primary research question here]'
            },
            {
                heading: 'Key Findings',
                content: '• Finding 1\n• Finding 2\n• Finding 3'
            },
            {
                heading: 'Methodology',
                content: '[Describe your research approach]'
            },
            {
                heading: 'Next Steps',
                content: '[Outline follow-up actions]'
            }
        ]
    };
}

function generateMeetingNotesTemplate(memoryContext) {
    return {
        title: 'Meeting Notes',
        subtitle: `${new Date().toLocaleDateString()} • ${new Date().toLocaleTimeString()}`,
        sections: [
            {
                heading: 'Attendees',
                content: '[List attendees]'
            },
            {
                heading: 'Agenda',
                content: '1. [Topic 1]\n2. [Topic 2]\n3. [Topic 3]'
            },
            {
                heading: 'Discussion Points',
                content: '[Key discussion points]'
            },
            {
                heading: 'Action Items',
                content: '• [ ] Action 1\n• [ ] Action 2\n• [ ] Action 3'
            }
        ]
    };
}

function generateArticleTemplate(memoryContext) {
    const userName = extractUserName(memoryContext.profile) || 'Author';
    
    return {
        title: '[Article Title]',
        subtitle: `By ${userName}`,
        sections: [
            {
                heading: 'Introduction',
                content: '[Hook and context]'
            },
            {
                heading: 'Background',
                content: '[Background information]'
            },
            {
                heading: 'Main Content',
                content: '[Core arguments and evidence]'
            },
            {
                heading: 'Conclusion',
                content: '[Summary and implications]'
            }
        ]
    };
}

function generateEmailResponseTemplate(memoryContext) {
    const userName = extractUserName(memoryContext.profile) || 'there';
    
    return {
        subject: 'Re: [Original Subject]',
        body: `<p>Hi [Name],</p>
        <p>Thank you for reaching out. [Response to key points]</p>
        <p>[Additional details or questions]</p>
        <p>Best regards,<br>${userName}</p>`
    };
}

function generateEmailFollowUpTemplate(memoryContext) {
    const userName = extractUserName(memoryContext.profile) || 'Sender';
    
    return {
        subject: 'Following up: [Original Topic]',
        body: `<p>Hi [Name],</p>
        <p>I wanted to follow up on [topic discussed]. [Status update or new information]</p>
        <p>[Next steps or questions]</p>
        <p>Best regards,<br>${userName}</p>`
    };
}

function generateEmailIntroductionTemplate(memoryContext) {
    const userName = extractUserName(memoryContext.profile) || 'Sender';
    const userRole = extractUserRole(memoryContext.profile) || 'Professional';
    
    return {
        subject: 'Introduction: [Your Name]',
        body: `<p>Hi [Name],</p>
        <p>My name is ${userName}, and I'm a ${userRole}. [Brief introduction and purpose]</p>
        <p>[Reason for reaching out and proposed next steps]</p>
        <p>Looking forward to connecting,<br>${userName}</p>`
    };
}

/******************************************************************************
 * PARSING UTILITIES
 * Extract structured data from memory markdown files
 ******************************************************************************/

function extractUserName(profileContent) {
    if (!profileContent) return null;
    const match = profileContent.match(/name:\s*(.+)/i);
    return match ? match[1].trim() : null;
}

function extractUserRole(profileContent) {
    if (!profileContent) return null;
    const match = profileContent.match(/role:\s*(.+)/i);
    return match ? match[1].trim() : null;
}

function parseFocusTrifectasToSkills(focusTrifectasContent) {
    if (!focusTrifectasContent) return [];
    
    // Simple parser for focus-trifectas.md format
    // Expected format:
    // ## Trifecta Name
    // 1. Skill 1
    // 2. Skill 2
    // 3. Skill 3
    
    const skills = [];
    const skillMatches = focusTrifectasContent.match(/^\d+\.\s*(.+)$/gm);
    
    if (skillMatches) {
        skillMatches.forEach(skill => {
            const skillName = skill.replace(/^\d+\.\s*/, '').trim();
            skills.push([
                skillName,
                'Beginner',  // Default values
                'Advanced',
                '0.25',      // 25% progress
                'Practice fundamentals'
            ]);
        });
    }
    
    return skills;
}

function parseFocusTrifectasToList(focusTrifectasContent) {
    if (!focusTrifectasContent) return [];
    
    const trifectas = [];
    const sections = focusTrifectasContent.split(/^##\s+/m).filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.split('\n');
        const name = lines[0].trim();
        const skills = lines.slice(1)
            .filter(line => /^\d+\./.test(line))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());
        
        if (skills.length > 0) {
            trifectas.push({ name, skills });
        }
    });
    
    return trifectas;
}

/******************************************************************************
 * PHASE 3: ADVANCED OUTLOOK UTILITIES
 * Sentiment analysis, smart reply generation, meeting parsing
 ******************************************************************************/

/**
 * Analyze sentiment of email content
 * @param {string} emailContent - Email text to analyze
 * @returns {string} Sentiment classification ('positive', 'negative', 'neutral', 'urgent')
 */
function analyzeSentiment(emailContent) {
    if (!emailContent) return 'neutral';
    
    const content = emailContent.toLowerCase();
    
    // Check for urgent keywords
    const urgentKeywords = ['urgent', 'asap', 'critical', 'emergency', 'immediately', 'deadline'];
    if (urgentKeywords.some(keyword => content.includes(keyword))) {
        return 'urgent';
    }
    
    // Check for negative sentiment
    const negativeKeywords = ['issue', 'problem', 'error', 'failed', 'wrong', 'concern', 'disappointed'];
    const negativeCount = negativeKeywords.filter(keyword => content.includes(keyword)).length;
    
    // Check for positive sentiment
    const positiveKeywords = ['thank', 'great', 'excellent', 'appreciate', 'happy', 'pleased', 'success'];
    const positiveCount = positiveKeywords.filter(keyword => content.includes(keyword)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
}

/**
 * Generate professional reply
 * @param {string} emailContent - Original email content
 * @param {string} userName - User's name
 * @param {string} sentiment - Email sentiment
 * @returns {string} HTML email content
 */
function generateProfessionalReply(emailContent, userName, sentiment) {
    const greetings = {
        'positive': 'Thank you for your email.',
        'negative': 'Thank you for bringing this to my attention.',
        'urgent': 'Thank you for your urgent message. I understand the time-sensitive nature of this matter.',
        'neutral': 'Thank you for reaching out.'
    };
    
    const greeting = greetings[sentiment] || greetings['neutral'];
    
    return `<p>Hi,</p>
<p>${greeting} I have reviewed your message and will respond with the following:</p>
<p>[Your detailed response here]</p>
<p>Please let me know if you need any additional information.</p>
<p>Best regards,<br>${userName}</p>`;
}

/**
 * Generate casual reply
 * @param {string} emailContent - Original email content
 * @param {string} userName - User's name
 * @param {string} sentiment - Email sentiment
 * @returns {string} HTML email content
 */
function generateCasualReply(emailContent, userName, sentiment) {
    const greetings = {
        'positive': 'Hey! Thanks for the message.',
        'negative': 'Hey, thanks for letting me know about this.',
        'urgent': 'Hey! Got your message – jumping on this right away.',
        'neutral': 'Hey there!'
    };
    
    const greeting = greetings[sentiment] || greetings['neutral'];
    
    return `<p>${greeting}</p>
<p>[Your response here]</p>
<p>Let me know if you have questions!</p>
<p>Thanks,<br>${userName}</p>`;
}

/**
 * Generate brief reply
 * @param {string} emailContent - Original email content
 * @param {string} userName - User's name
 * @param {string} sentiment - Email sentiment
 * @returns {string} HTML email content
 */
function generateBriefReply(emailContent, userName, sentiment) {
    const responses = {
        'positive': 'Thanks! [Brief response]',
        'negative': 'Noted. [Brief resolution]',
        'urgent': 'On it. [Quick confirmation]',
        'neutral': 'Acknowledged. [Brief reply]'
    };
    
    const response = responses[sentiment] || responses['neutral'];
    
    return `<p>${response}</p>
<p>– ${userName}</p>`;
}

/**
 * Parse email for meeting details
 * @param {string} emailContent - Email content to parse
 * @returns {object} Meeting details {subject, date, time, hasValidDate, location, attendees}
 */
function parseMeetingDetails(emailContent) {
    const details = {
        subject: 'Meeting',
        date: null,
        time: null,
        hasValidDate: false,
        location: '',
        attendees: []
    };
    
    if (!emailContent) return details;
    
    // Extract subject (usually in first line or after "re:" or "subject:")
    const subjectMatch = emailContent.match(/(?:re:|subject:)\s*(.+)/i);
    if (subjectMatch) {
        details.subject = subjectMatch[1].trim().split('\n')[0];
    }
    
    // Simple date parsing (matches common formats)
    const datePatterns = [
        /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,  // MM/DD/YYYY or DD/MM/YYYY
        /(\w+)\s+(\d{1,2}),?\s+(\d{4})/,     // Month DD, YYYY
        /(next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
    ];
    
    for (const pattern of datePatterns) {
        const match = emailContent.match(pattern);
        if (match) {
            details.date = match[0];
            details.hasValidDate = true;
            break;
        }
    }
    
    // Time parsing
    const timeMatch = emailContent.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (timeMatch) {
        details.time = timeMatch[0];
    }
    
    // Location parsing
    const locationMatch = emailContent.match(/(?:location|room|at|in):\s*(.+)/i);
    if (locationMatch) {
        details.location = locationMatch[1].trim().split('\n')[0];
    }
    
    return details;
}

/**
 * Create Outlook appointment URL for quick creation
 * @param {object} meetingDetails - Meeting details
 * @returns {string} Outlook web appointment creation URL
 */
function createOutlookAppointmentUrl(meetingDetails) {
    const baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose';
    const params = new URLSearchParams({
        subject: meetingDetails.subject || 'Meeting',
        body: `Location: ${meetingDetails.location || 'TBD'}`,
        startdt: meetingDetails.date ? new Date(meetingDetails.date).toISOString() : new Date().toISOString(),
        enddt: meetingDetails.date ? new Date(new Date(meetingDetails.date).getTime() + 3600000).toISOString() : new Date().toISOString()
    });
    
    return `${baseUrl}?${params.toString()}`;
}

// Export functions for use in taskpane.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Word operations
        wordInsertText,
        wordInsertMermaidDiagram,
        wordInsertFromTemplate,
        
        // Excel operations
        excelCreateGoalsTracker,
        excelCreateSkillChart,
        
        // PowerPoint operations
        powerpointCreateTrifectaSlide,
        powerpointInsertSVG,
        powerpointApplyAnimations,
        
        // Outlook operations
        outlookDraftEmail,
        outlookInsertUrgentMarker,
        outlookGenerateSmartReplies,
        outlookCreateMeetingFromEmail,
        
        // Microsoft Graph
        getGraphAccessToken,
        readOneDriveMemoryFile,
        loadAlexMemory
    };
}
