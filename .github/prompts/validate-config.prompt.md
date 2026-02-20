# Validate Extension Configuration

> **Avatar**: Call `alex_cognitive_state_update` with `state: "reviewing"`. This updates the welcome sidebar avatar.

Validate VS Code extension manifest configuration and command registration

## Prompt

You are reviewing a VS Code extension for configuration and manifest consistency issues.

**Task**: Systematically validate that:
1. All `workspace.getConfiguration().update()` calls are properly handled
2. All `registerCommand()` calls match package.json declarations
3. Configuration reads have appropriate defaults
4. Dynamic configuration uses graceful degradation patterns

**Process**:

1. **Run automated validation**:
   ```powershell
   cd platforms/vscode-extension
   .\scripts\validate-manifest.ps1
   ```

2. **Review results**:
   - ✅ **Passing**: Report success, extension is properly configured
   - ⚠️ **Warnings**: Review each warning to verify try-catch pattern is intentional for dynamic configs
   - ❌ **Errors**: Critical issues that must be fixed before release

3. **For each error found**:
   - **Option A**: Register the configuration in package.json `configuration.properties`
   - **Option B**: Wrap in try-catch if it's non-critical dynamic configuration
   - Document the decision rationale

4. **Verify fixes**:
   - Re-run validation script
   - Test configuration updates in clean VS Code instance
   - Confirm features work correctly

5. **Report findings**:
   - List all issues found
   - Show applied fixes
   - Confirm validation passes

**Guidance**:
- Use **Pattern A** (register in package.json) for user-facing settings
- Use **Pattern B** (try-catch) for analytics/tracking with dynamic keys
- Always provide default values in `.get()` calls
- Critical configuration should fail loudly (no try-catch)

**Cross-reference**: `.github/instructions/vscode-configuration-validation.instructions.md`

## Sample

User: "/validateConfig"

Alex:
1. Running manifest validation script...
2. [Shows script output]
3. Found X issues:
   - [Details each issue with file:line]
4. Recommended fixes:
   - [Specific fix for each issue]
5. [Applies fixes if approved]
6. Re-running validation... ✅ All checks pass


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: null` to restore default avatar.