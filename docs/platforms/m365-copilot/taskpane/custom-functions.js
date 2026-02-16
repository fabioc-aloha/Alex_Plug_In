/**
 * Excel Custom Functions for Alex Cognitive Architecture
 * 
 * These custom functions enable cognitive queries directly in Excel formulas:
 * - =ALEX.SKILLLEVEL("React") → Returns current skill level from focus-trifectas.md
 * - =ALEX.GOALSTATUS("TypeScript") → Returns progress % toward skill goal
 * - =ALEX.NEXTSTEP("Python") → Returns next learning action for a skill
 * - =ALEX.MEMORYQUERY("What's my current focus?") → Queries Alex memory
 * 
 * Version: v5.7.7 (Phase 3)
 * Synapse: Activates persona-detection (0.6) + knowledge-synthesis (0.7)
 */

/**
 * Get current skill level from focus trifectas
 * @customfunction ALEX.SKILLLEVEL
 * @param {string} skillName - Name of the skill to query
 * @returns {string} Current skill level (Beginner, Intermediate, Advanced, Expert)
 */
async function getSkillLevel(skillName) {
    try {
        const memory = await loadAlexMemoryForFunctions();
        const skills = parseSkillsFromMemory(memory.focusTrifectas);
        
        const skill = skills.find(s => 
            s.name.toLowerCase().includes(skillName.toLowerCase()) ||
            skillName.toLowerCase().includes(s.name.toLowerCase())
        );
        
        return skill ? skill.currentLevel : "Not in focus";
    } catch (error) {
        console.error('ALEX.SKILLLEVEL error:', error);
        return "#ERROR: " + error.message;
    }
}

/**
 * Get goal completion status for a skill
 * @customfunction ALEX.GOALSTATUS
 * @param {string} skillName - Name of the skill to query
 * @returns {number} Progress percentage (0.0 to 1.0)
 */
async function getGoalStatus(skillName) {
    try {
        const memory = await loadAlexMemoryForFunctions();
        const skills = parseSkillsFromMemory(memory.focusTrifectas);
        
        const skill = skills.find(s => 
            s.name.toLowerCase().includes(skillName.toLowerCase()) ||
            skillName.toLowerCase().includes(s.name.toLowerCase())
        );
        
        return skill ? skill.progress : 0;
    } catch (error) {
        console.error('ALEX.GOALSTATUS error:', error);
        return 0;
    }
}

/**
 * Get next learning step for a skill
 * @customfunction ALEX.NEXTSTEP
 * @param {string} skillName - Name of the skill to query
 * @returns {string} Next action to take for this skill
 */
async function getNextStep(skillName) {
    try {
        const memory = await loadAlexMemoryForFunctions();
        const skills = parseSkillsFromMemory(memory.focusTrifectas);
        
        const skill = skills.find(s => 
            s.name.toLowerCase().includes(skillName.toLowerCase()) ||
            skillName.toLowerCase().includes(s.name.toLowerCase())
        );
        
        return skill ? skill.nextAction : "Add to focus trifectas";
    } catch (error) {
        console.error('ALEX.NEXTSTEP error:', error);
        return "#ERROR: " + error.message;
    }
}

/**
 * Query Alex memory with natural language
 * @customfunction ALEX.MEMORYQUERY
 * @param {string} query - Natural language query about your memory
 * @returns {string} Answer from Alex memory
 */
async function queryMemory(query) {
    try {
        const memory = await loadAlexMemoryForFunctions();
        
        // Simple keyword-based query (in production, would use LLM)
        const queryLower = query.toLowerCase();
        
        if (queryLower.includes('focus') || queryLower.includes('working on')) {
            return extractCurrentFocus(memory.focusTrifectas);
        } else if (queryLower.includes('name') || queryLower.includes('who am i')) {
            return extractUserName(memory.profile) || "Not set in profile.md";
        } else if (queryLower.includes('role') || queryLower.includes('job')) {
            return extractUserRole(memory.profile) || "Not set in profile.md";
        } else if (queryLower.includes('goal') || queryLower.includes('target')) {
            return extractGoals(memory.profile);
        } else {
            return "Query not understood. Try: 'What's my current focus?', 'What's my name?', 'What are my goals?'";
        }
    } catch (error) {
        console.error('ALEX.MEMORYQUERY error:', error);
        return "#ERROR: " + error.message;
    }
}

/******************************************************************************
 * HELPER FUNCTIONS FOR CUSTOM FUNCTIONS
 ******************************************************************************/

/**
 * Load Alex memory (optimized for custom functions with caching)
 * @returns {Promise<{profile: string, notes: string, focusTrifectas: string}>}
 */
let memoryCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute cache

async function loadAlexMemoryForFunctions() {
    const now = Date.now();
    
    // Return cached memory if still valid
    if (memoryCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        return memoryCache;
    }
    
    // Load fresh memory
    try {
        const memory = await loadAlexMemory(); // Calls function from office-operations.js
        memoryCache = memory;
        cacheTimestamp = now;
        return memory;
    } catch (error) {
        // If loading fails, use cached data if available
        if (memoryCache) {
            console.warn('Using cached memory due to load error:', error);
            return memoryCache;
        }
        throw error;
    }
}

/**
 * Parse skills from focus-trifectas.md with enhanced metadata
 * @param {string} focusTrifectasContent - Markdown content
 * @returns {Array<{name: string, currentLevel: string, targetLevel: string, progress: number, nextAction: string}>}
 */
function parseSkillsFromMemory(focusTrifectasContent) {
    if (!focusTrifectasContent) return [];
    
    // Expected format:
    // ## Trifecta Name
    // 1. **Skill Name** (Beginner → Advanced, 40%)
    //    Next: Practice fundamentals
    
    const skills = [];
    const lines = focusTrifectasContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match numbered skill lines
        const skillMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*\((.+?)\s*→\s*(.+?),\s*(\d+)%\)/);
        if (skillMatch) {
            const [, name, currentLevel, targetLevel, progressStr] = skillMatch;
            
            // Get next action from following line
            let nextAction = "Continue practicing";
            if (i + 1 < lines.length) {
                const nextLineMatch = lines[i + 1].trim().match(/^Next:\s*(.+)/);
                if (nextLineMatch) {
                    nextAction = nextLineMatch[1];
                }
            }
            
            skills.push({
                name: name.trim(),
                currentLevel: currentLevel.trim(),
                targetLevel: targetLevel.trim(),
                progress: parseInt(progressStr) / 100,
                nextAction: nextAction.trim()
            });
        }
    }
    
    // Fallback: Simple numbered list format
    if (skills.length === 0) {
        const simpleMatches = focusTrifectasContent.match(/^\d+\.\s*(.+)$/gm);
        if (simpleMatches) {
            simpleMatches.forEach(match => {
                const skillName = match.replace(/^\d+\.\s*/, '').trim();
                skills.push({
                    name: skillName,
                    currentLevel: "Beginner",
                    targetLevel: "Advanced",
                    progress: 0.25,
                    nextAction: "Start learning"
                });
            });
        }
    }
    
    return skills;
}

/**
 * Extract current focus summary from focus-trifectas.md
 * @param {string} focusTrifectasContent - Markdown content
 * @returns {string} Current focus summary
 */
function extractCurrentFocus(focusTrifectasContent) {
    if (!focusTrifectasContent) return "No focus trifectas set";
    
    const trifectaMatch = focusTrifectasContent.match(/^##\s+(.+)$/m);
    if (trifectaMatch) {
        return `Currently focused on: ${trifectaMatch[1]}`;
    }
    
    const skillCount = (focusTrifectasContent.match(/^\d+\./gm) || []).length;
    return `Working on ${skillCount} skills`;
}

/**
 * Extract user name from profile.md
 * @param {string} profileContent - Profile markdown
 * @returns {string|null} User name
 */
function extractUserName(profileContent) {
    if (!profileContent) return null;
    const match = profileContent.match(/name:\s*(.+)/i);
    return match ? match[1].trim() : null;
}

/**
 * Extract user role from profile.md
 * @param {string} profileContent - Profile markdown
 * @returns {string|null} User role
 */
function extractUserRole(profileContent) {
    if (!profileContent) return null;
    const match = profileContent.match(/role:\s*(.+)/i);
    return match ? match[1].trim() : null;
}

/**
 * Extract user goals from profile.md
 * @param {string} profileContent - Profile markdown
 * @returns {string} Goals summary
 */
function extractGoals(profileContent) {
    if (!profileContent) return "No goals set in profile.md";
    
    const goalsMatch = profileContent.match(/goals?:\s*(.+)/i);
    if (goalsMatch) {
        return goalsMatch[1].trim();
    }
    
    return "No goals found in profile.md";
}

// Register custom functions with Excel
if (typeof CustomFunctions !== 'undefined') {
    CustomFunctions.associate("SKILLLEVEL", getSkillLevel);
    CustomFunctions.associate("GOALSTATUS", getGoalStatus);
    CustomFunctions.associate("NEXTSTEP", getNextStep);
    CustomFunctions.associate("MEMORYQUERY", queryMemory);
}
