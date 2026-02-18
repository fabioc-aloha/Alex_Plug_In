/**
 * Chat Interface for Alex Office Add-in
 * Full conversational UI with M365 Copilot backend integration
 * 
 * Version: v5.9.0
 */

let chatHistory = [];
let isProcessing = false;

/**
 * Initialize chat interface
 */
async function initializeChatInterface() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) {
        console.error('Chat container not found');
        return;
    }

    // Load chat history from localStorage (if available)
    const savedHistory = localStorage.getItem('alexChatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        renderChatHistory();
    }

    // Setup event listeners
    const sendButton = document.getElementById('chatSend');
    const inputField = document.getElementById('chatInput');

    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }

    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // Load initial context from memory
    await loadMemoryContext();
}

/**
 * Handle sending a message
 */
async function handleSendMessage() {
    const inputField = document.getElementById('chatInput');
    const message = inputField.value.trim();

    if (!message || isProcessing) return;

    // Clear input
    inputField.value = '';

    // Add user message to history
    addMessageToHistory('user', message);

    // Show typing indicator
    showTypingIndicator();
    isProcessing = true;

    try {
        // Send to M365 Copilot or Azure OpenAI
        const response = await sendToChatBackend(message);

        // Remove typing indicator
        hideTypingIndicator();

        // Add assistant response
        addMessageToHistory('assistant', response);

    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addMessageToHistory('system', 'Sorry, I encountered an error. Please try again.');
    } finally {
        isProcessing = false;
    }
}

/**
 * Send message to chat backend (M365 Copilot or Azure OpenAI)
 * @param {string} message - User message
 * @returns {Promise<string>} Assistant response
 */
async function sendToChatBackend(message) {
    // Option 1: Use M365 Copilot API (when available)
    // Option 2: Use Azure OpenAI endpoint
    // Option 3: Use custom backend API

    // For now, return simulated response
    // TODO: Integrate with actual backend

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateSimulatedResponse(message));
        }, 1500);
    });
}

/**
 * Generate simulated response (placeholder for backend integration)
 * @param {string} message - User message
 * @returns {string} Simulated response
 */
function generateSimulatedResponse(message) {
    const messageLower = message.toLowerCase();

    if (messageLower.includes('focus') || messageLower.includes('trifecta')) {
        return "Based on your focus-trifectas.md, you're currently working on React, TypeScript, and Testing Strategies. Would you like me to help you with any of these skills?";
    } else if (messageLower.includes('goal')) {
        return "Your current goals include mastering TypeScript (75% complete) and improving testing practices (40% complete). Great progress! What would you like to work on next?";
    } else if (messageLower.includes('meeting') || messageLower.includes('prep')) {
        return "I can help you prepare for your next meeting. Let me check your calendar and gather context about the attendees. One moment...";
    } else if (messageLower.includes('email') || messageLower.includes('draft')) {
        return "I'll help you draft a professional email. What's the purpose of this email? (Response, Follow-up, or Introduction)";
    } else if (messageLower.includes('template')) {
        return "I have templates for Research Summaries, Meeting Notes, and Articles. Which would you like to insert into your document?";
    } else {
        return `I understand you're asking about: "${message}". I can help with focus tracking, meeting prep, email drafting, and document templates. What would you like to work on?`;
    }
}

/**
 * Add message to chat history and render
 * @param {string} role - 'user', 'assistant', or 'system'
 * @param {string} content - Message content
 */
function addMessageToHistory(role, content) {
    const timestamp = new Date().toISOString();
    const messageObject = { role, content, timestamp };

    chatHistory.push(messageObject);

    // Save to localStorage
    localStorage.setItem('alexChatHistory', JSON.stringify(chatHistory));

    // Render the new message
    renderMessage(messageObject);

    // Scroll to bottom
    scrollChatToBottom();
}

/**
 * Render a single chat message
 * @param {object} message - Message object {role, content, timestamp}
 */
function renderMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message chat-message-${message.role}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-avatar';
    avatarDiv.textContent = message.role === 'user' ? '👤' : (message.role === 'system' ? '⚙️' : '🤖');

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'chat-text';
    textDiv.textContent = message.content;

    const timeDiv = document.createElement('div');
    timeDiv.className = 'chat-timestamp';
    timeDiv.textContent = formatTimestamp(message.timestamp);

    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    messagesContainer.appendChild(messageDiv);
}

/**
 * Render entire chat history
 */
function renderChatHistory() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    chatHistory.forEach(message => {
        renderMessage(message);
    });

    scrollChatToBottom();
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'chat-message chat-message-assistant';

    typingDiv.innerHTML = `
        <div class="chat-avatar">🤖</div>
        <div class="chat-content">
            <div class="chat-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    scrollChatToBottom();
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Load memory context and create initial greeting
 */
async function loadMemoryContext() {
    try {
        const memory = await loadAlexMemory(); // From office-operations.js
        const userName = extractUserName(memory.profile) || 'there';

        if (chatHistory.length === 0) {
            // Add welcome message
            addMessageToHistory('assistant', `Hi ${userName}! I'm Alex, your cognitive learning partner. I have access to your OneDrive memory and can help you with:\n\n• Morning briefings and meeting prep\n• Learning goal tracking\n• Document templates\n• Email drafting\n\nWhat would you like to work on?`);
        }
    } catch (error) {
        console.error('Memory loading error:', error);
        if (chatHistory.length === 0) {
            addMessageToHistory('assistant', "Hi! I'm Alex. I'm having trouble accessing your OneDrive memory right now, but I can still help you. What would you like to work on?");
        }
    }
}

/**
 * Clear chat history
 */
function clearChatHistory() {
    if (confirm('Clear all chat history? This cannot be undone.')) {
        chatHistory = [];
        localStorage.removeItem('alexChatHistory');
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        loadMemoryContext(); // Reload welcome message
    }
}

/**
 * Export chat history to markdown
 */
function exportChatHistory() {
    let markdown = '# Alex Chat History\n\n';
    markdown += `Exported: ${new Date().toLocaleString()}\n\n---\n\n`;

    chatHistory.forEach(message => {
        const timestamp = new Date(message.timestamp).toLocaleString();
        const role = message.role === 'user' ? 'You' : (message.role === 'system' ? 'System' : 'Alex');
        markdown += `**${role}** (${timestamp})\n\n`;
        markdown += `${message.content}\n\n---\n\n`;
    });

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alex-chat-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

// Export functions for use in taskpane.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeChatInterface,
        handleSendMessage,
        clearChatHistory,
        exportChatHistory
    };
}
