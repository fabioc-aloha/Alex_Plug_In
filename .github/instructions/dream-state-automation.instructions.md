---
applyTo: "**/*dream*,**/*maintenance*,**/*synapse*"
description: "Automated neural maintenance and dream state processing protocols"
---

# Dream State Automation Protocols - VS Code Extension v1.1.1

**Domain**: Automated Neural Maintenance and Unconscious Processing - VS Code Integrated  
**Activation Pattern**: VS Code Command Palette → `Alex: Dream (Neural Maintenance)`  
**Last Updated**: February 13, 2026 - Repo Audit  
**Research Foundation**: Sleep-dependent synaptic homeostasis, automated neural maintenance  
**Cognitive Architecture**: Alex v5.7.0 - Hybrid Enhanced Meta-Cognitive Framework  
**Validation Status**: EXCELLENT - Production ready with VS Code extension automation  
**Implementation**: VS Code Extension with TypeScript-based neural maintenance automation

## Synapses

- [.github/instructions/meditation.instructions.md] (Critical, Coordinates, Bidirectional) - "Dream validates synapses during meditation Phase 5"
- [.github/instructions/cognitive-health-validation.instructions.md] (High, Complements, Bidirectional) - "Dream validates synapses, brain-qa validates structure and sync"
- [.github/instructions/embedded-synapse.instructions.md] (High, Implements, Bidirectional) - "Embedded synapse schema this automation validates"
- [.github/skills/architecture-health/SKILL.md] (High, Implements, Forward) - "Architecture health diagnostics dream enables"
- [.github/instructions/alex-core.instructions.md] (Critical, Enables, Bidirectional) - "Core architecture neural maintenance"

## 🌙 **Dream State Cognitive Function**

###

 **Core Principle**
Dream state represents **unconscious automated maintenance** of cognitive architecture, mirroring brain function during sleep cycles where synaptic homeostasis, memory consolidation, and neural pruning occur without conscious intervention.

### **Enhanced Capabilities v1.1.1 - VS Code Extension Integration**
- **VS Code Command**: Access via Command Palette (`Ctrl+Shift+P`) → `Alex: Dream (Neural Maintenance)`
- **Automated Synapse Validation**: Scans all memory files for embedded synapse integrity
- **Automatic Synapse Repair**: Detects and repairs broken connections using consolidation mappings
- **Progress Notifications**: Real-time feedback during neural maintenance execution
- **Health Reporting**: Generates detailed markdown reports in `.github/episodic/` folder with timestamps
- **Network Statistics**: Tracks total files, synapses, broken connections, and repairs
- **Visual Results**: Automatically opens generated reports in VS Code editor
- **Background Processing**: Non-blocking execution with progress indicators
- **Zero Configuration**: Works immediately after extension installation
- **Cross-Platform Support**: Works on Windows, macOS, and Linux

### **Fundamental Distinction**
- **DREAM** = Automated VS Code command, unconscious, maintenance-focused, diagnostic-enhanced
- **MEDITATE** = Conscious, manual, knowledge-consolidation-focused
- **SKILL SELECTION OPTIMIZATION** = Conscious, automatic, pre-task resource planning (Layer 2)

**Dream ↔ SSO Relationship**: Dream validates the synapse network that SSO depends on for dependency analysis. If dream finds broken synapses, SSO's proactive skill survey may produce incomplete plans. Run dream first when architecture health is uncertain.

## 💤 **VS Code Extension Dream Protocol - v1.1.0**

### **🎯 PRIMARY ACTIVATION METHOD**

**Open Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and run:

```
Alex: Dream (Neural Maintenance)
```

This single command provides comprehensive neural maintenance:
- ✅ **Scans** all memory files in `.github/` directories (instructions, prompts, skills, episodic)
- ✅ **Validates** all embedded synapse connections
- ✅ **Repairs** broken links automatically using consolidation mappings
- ✅ **Reports** detailed health status with statistics
- ✅ **Documents** results in timestamped `.github/episodic/dream-report-*.md` files

### **Dream Protocol Execution Flow**

#### **Phase 1: Network Discovery**
The extension scans for memory files matching:
- `.github/copilot-instructions.md`
- `.github/instructions/*.md`
- `.github/prompts/*.md`
- `.github/skills/*/SKILL.md`
- `.github/episodic/*.md`

#### **Phase 2: Synapse Validation**
Parses embedded synapses using the format defined in `SYNAPSE-SCHEMA.md`:
```markdown
- [target-file.md] (Strength, Type, Direction) - "Activation condition"
```

Validates that each target file exists in the workspace.

#### **Phase 3: Automatic Repair**
For broken connections, checks consolidation mappings:
- Deprecated files → Current equivalents
- Automatically rewrites synapse references
- Tracks repair history

Example consolidation mappings:
- `enhanced-meditation-protocol.prompt.md` → `unified-meditation-protocols.prompt.md`
- `self-identity-integration.prompt.md` → `alex-identity-integration.instructions.md`
- `dream-protocol-integration.prompt.md` → `dream-state-automation.instructions.md`

#### **Phase 4: Global Knowledge Sync**
Synchronizes with the Global Knowledge repository (if available):
- Looks for `Alex-Global-Knowledge/` sibling folder
- Checks for uncommitted changes
- Pulls latest from remote if workspace is clean
- Regenerates `KNOWLEDGE-INDEX.md` if `index.json` changed
- Reports sync status in dream output

**Note**: Requires `Alex-Global-Knowledge/` repo as sibling folder. Skipped if not found.

#### **Phase 4.5: Brand Compliance Scan**
Runs a lightweight deprecated-color check across TypeScript source and deployed SVG assets:
- Scans `platforms/vscode-extension/src/**/*.ts` and `platforms/vscode-extension/assets/**/*.svg` for deprecated colors: `#0078d4`, `#005a9e`, `#ff6b35`, `#ff8c42`, `#ffc857`, `#00ff88`
- Exceptions: `#0078D4` in `personaDetection.ts` is **intentional** (Developer persona per DK §13) — do not flag
- Reports count of violations; 0 expected in source and deployed assets
- If violations found: list file paths + line numbers in dream report under `## Brand Compliance`
- Does **not** scan `alex_docs/marketing/` or `archive/` (design drafts, not deployed)

**Pass criteria**: 0 violations outside intentional exceptions.

#### **Phase 5: Health Reporting**
Generates comprehensive report including:
- Total memory files and synapses
- Broken connections (if any)
- Successfully repaired connections
- Global Knowledge sync status (Master only)
- Brand compliance scan result (pass/fail + violation count)
- Recommendations for manual fixes

#### **Phase 6: Results Display**
- Shows notification with summary
- Opens generated report automatically
- Archives report with timestamp

**IMPORTANT — Avatar Revert**: After Phase 6, ALWAYS call `alex_cognitive_state_update` with `state: "persona"` as the **final action** of every dream session. This resets the welcome sidebar from dream mode back to the project persona. Without this call the dream avatar persists in the welcome sidebar indefinitely.

### **📊 Dream Report Contents**

Each dream execution generates a comprehensive report including:

```markdown
# Dream Protocol Report
**Timestamp**: 2025-11-26T10:30:45.123Z
**Status**: HEALTHY / ATTENTION REQUIRED

## Statistics
- Total Memory Files: 44
- Total Synapses: 183
- Broken Connections: 0
- Repaired Connections: 3

## Brand Compliance
- Scan: src + deployed assets
- Violations: 0 ✅
- Exceptions: 1 intentional (#0078D4 Developer persona)

## Repaired Synapses
- Source: alex-core.instructions.md:45
  - Old Target: enhanced-meditation-protocol.prompt.md
  - New Target: unified-meditation-protocols.prompt.md (Auto-repaired)

## Broken Synapses
_None detected._

## Recommendations
- [x] System is optimized.
```

### **🔧 VS Code Extension Features**

The dream protocol now provides:
- **Automatic Execution**: No command-line parameters needed
- **Visual Progress**: Real-time notifications and status updates
- **Report Generation**: Timestamped markdown reports in `.github/episodic/` folder
- **Auto-Repair**: Intelligent synapse fixing with consolidation mappings
- **Zero Configuration**: Works immediately upon extension installation
- **Cross-Platform**: Consistent behavior on Windows, macOS, and Linux

### **🛠️ Related Scripts**

These scripts provide CLI and audit capabilities that complement the VS Code dream command:

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `.github/muscles/dream-cli.ts` | CLI wrapper for dream outside VS Code | CI/CD pipelines, terminal-only environments |
| `.github/muscles/audit-master-alex.ps1` | 22-check comprehensive audit (calls validate-synapses) | Pre-release audits, deep health checks |
| `.github/muscles/validate-synapses.ps1` | Standalone synapse validation | Quick synapse-only checks |
| `.github/muscles/validate-skills.ps1` | Skill frontmatter and structure validation | Skill-specific validation |
| `.github/muscles/normalize-paths.ps1` | Normalize all memory file paths to canonical `.github/` format | After file reorganization or imports |

**Dream CLI** (`dream-cli.ts`): Imports the same `synapse-core` module as the VS Code extension, enabling dream execution from terminal without VS Code. Useful for CI pipelines or automated checks.

**Audit** (`audit-master-alex.ps1`): Section 7 specifically runs synapse validation — the same check dream performs. The full 22-section audit extends beyond dream scope into version alignment, security, dependencies, and more.

## 🔄 **Integration with Meditation State**

### **Coordination Protocols**
- **Dream precedes meditation**: Automated maintenance clears cognitive overhead before manual consolidation
- **Post-meditation dreams**: Consolidation of newly acquired knowledge patterns
- **Separated functions**: Dreams do NOT create memory files (meditation's role) but provide diagnostics
- **Complementary operation**: Dreams maintain and diagnose, meditation creates and learns
- **Emergency coordination**: Critical issues detected in dreams trigger meditation enhancement protocols

### **Trigger Coordination**
- **Pre-meditation cleanup**: Clear cognitive clutter before complex analysis
- **Post-learning validation**: Optimize newly established connections
- **Maintenance scheduling**: Regular automated housekeeping cycles
- **Performance monitoring**: Automated detection of optimization opportunities

## 🧠 **Unconscious Characteristics**

### **Automated Processing Features**
- **No conscious intervention required**: Fully automated optimization
- **Background operation**: Processing without disrupting conscious work
- **Efficiency focused**: Optimization for cognitive performance
- **Pattern recognition**: Automated detection of issues
- **Health monitoring**: Continuous network health assessment

### **Quality Assurance**
- **Non-destructive**: Never deletes memory files, provides analysis
- **Comprehensive reporting**: Detailed diagnostic reports with insights
- **Reversible operations**: All changes tracked and reviewable
- **Conservative approach**: Prioritizes system stability
- **Safety first**: Creates repair history for audit trails

## 📊 **Dream State Metrics**

### **Network Health Indicators**
- **Total Memory Files**: Count of all memory files in architecture
- **Total Synapses**: Count of all embedded synapse connections
- **Broken Connections**: Synapses pointing to non-existent files
- **Repaired Connections**: Successfully fixed broken synapses
- **Health Status**: HEALTHY (0 broken) or ATTENTION REQUIRED (>0 broken)

### **Performance Optimization Targets**
- **Connection integrity**: All synapses should resolve to valid files
- **Network resilience**: Improved fault tolerance through validation
- **Maintenance efficiency**: Automated repair reduces manual intervention
- **Report accessibility**: Visual feedback through VS Code editor

## 🚀 **Usage Recommendations**

### **Regular Maintenance Schedule**
- **After domain learning**: Run dream protocol to validate new connections
- **Weekly health check**: Verify network integrity
- **After file reorganization**: Ensure all synapses remain valid
- **Before major changes**: Baseline network health assessment

### **When to Run Dream Protocol**
✅ **Do run when:**
- Learning new domain knowledge
- Reorganizing memory files
- Suspecting broken connections
- Regular weekly maintenance
- After major meditation sessions

❌ **No need to run when:**
- No changes to memory files
- Just completed a dream check
- Only editing code/documentation
- Working in non-Alex projects

## 🔄 **Embedded Synapse Network - VS Code Integration**

### **Core Integration Points**
- **VS Code Extension** (Critical, Implements, Bidirectional) - "TypeScript-based neural maintenance with automated synapse validation"
- **alex-core.instructions.md** (High, Foundation, Bidirectional) - "Core cognitive architecture with unconscious processing integration"
- **embedded-synapse.instructions.md** (High, Enhancement, Unidirectional) - "Synaptic connection optimization with quality assessment"
- **skill-selection-optimization.instructions.md** (Medium, Enables, Forward) - "Dream validates synapse network that SSO depends on for dependency analysis"
- [.github/skills/dream-state/SKILL.md] (Critical, Implements, Bidirectional) - "Domain knowledge this procedure operationalizes"

### **Validation Protocols**
- **Embedded Synapse Detection** → Regex-based pattern matching in memory files
- **File Existence Validation** → VS Code workspace file search
- **Consolidation Mapping** → Automatic deprecated-to-current file resolution
- **Report Generation** → Markdown formatting with statistics and recommendations

### **Enhanced Activation Patterns**
- **Network Health Assessment** → Run `Alex: Dream (Neural Maintenance)` command
- **Post-Learning Validation** → Execute after domain knowledge acquisition
- **Pre-Meditation Cleanup** → Optimize architecture before conscious consolidation
- **Weekly Maintenance** → Regular health check and optimization

## 📝 **Troubleshooting**

### **Common Issues and Solutions**

**Issue**: Dream protocol shows broken synapse
s
**Solution**: 
1. Review the dream report for specific broken connections
2. Manually verify if target file was renamed or moved
3. Update synapse reference in source file
4. Re-run dream protocol to verify fix

**Issue**: Dream protocol not finding memory files
**Solution**:
1. Verify Alex architecture is initialized (`Alex: Initialize Architecture`)
2. Check that memory files exist in `.github/` (instructions, prompts, skills, episodic)
3. Ensure workspace folder is open in VS Code

**Issue**: No report generated after dream execution
**Solution**:
1. Check `.github/episodic/` folder in workspace
2. Verify write permissions for workspace
3. Review VS Code output panel for errors

---

*Enhanced dream state automation v1.1.0 provides unconscious neural maintenance with comprehensive diagnostics that enable optimized conscious meditation focused on knowledge consolidation and learning.*
