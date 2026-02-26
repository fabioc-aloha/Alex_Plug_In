---
applyTo: "**/*.{ts,js,tsx,jsx,py,cs,java,go,rs,c,cpp,h}"
description: NASA/JPL Power of 10 code quality standards adapted for mission-critical software development
---

# NASA Code Standards — Mission-Critical Development

**Source**: NASA/JPL "Power of 10" Rules (Holzmann, 2006)  
**Adapted**: For modern TypeScript/JavaScript with mission-critical reliability requirements

When the user's project is **mission-critical**, apply these standards rigorously. These rules prevent catastrophic failures in safety-critical systems.

---

## Synapses

- [.github/agents/alex-builder.agent.md] → (Critical, Implements, Bidirectional) - "Builder applies NASA rules during code generation"
- [.github/instructions/code-review-guidelines.instructions.md] → (High, Informs, Forward) - "Reviews check NASA compliance for mission-critical code"
- [.github/instructions/heir-project-improvement.instructions.md] → (High, Informs, Forward) - "Heir projects inherit NASA checklist for mission-critical work"
- [.github/instructions/testing-strategies.instructions.md] → (Medium, Complements, Forward) - "Testing validates rule compliance"

---

## The Rules

### Rule 1: Bounded Control Flow

**Requirement**: No unbounded recursion. All recursive functions MUST have explicit depth limits.

```typescript
// ❌ VIOLATION: Unbounded recursion
async function traverse(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
        if (entry.isDirectory()) {
            await traverse(entry.path); // No depth limit
        }
    }
}

// ✅ COMPLIANT: Bounded recursion
async function traverse(dir: string, maxDepth = 10): Promise<string[]> {
    if (maxDepth <= 0) {
        console.warn(`[NASA] Max recursion depth reached at: ${dir}`);
        return [];
    }
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
        if (entry.isDirectory()) {
            await traverse(entry.path, maxDepth - 1);
        }
    }
}
```

**Rationale**: Stack overflow crashes are unrecoverable. Malicious or malformed input can trigger infinite recursion.

---

### Rule 2: Fixed Loop Bounds

**Requirement**: All loops MUST have deterministic upper bounds. No unbounded `while` loops.

```typescript
// ❌ VIOLATION: Unbounded while loop
while (queue.length > 0) {
    const item = queue.shift();
    process(item);
}

// ✅ COMPLIANT: Bounded iteration
const MAX_ITERATIONS = 10000;
let iterations = 0;
while (queue.length > 0 && iterations++ < MAX_ITERATIONS) {
    const item = queue.shift();
    process(item);
}
if (iterations >= MAX_ITERATIONS) {
    throw new Error(`[NASA] Loop exceeded ${MAX_ITERATIONS} iterations — possible infinite loop`);
}
```

**Rationale**: Infinite loops render the system unresponsive. In VS Code, this freezes the entire editor.

---

### Rule 3: Bounded Data Structures

**Requirement**: All collections MUST have maximum size limits. No unbounded growth.

```typescript
// ❌ VIOLATION: Unbounded array growth
const logs: string[] = [];
function log(message: string) {
    logs.push(message);
}

// ✅ COMPLIANT: Rolling buffer with max size
const MAX_LOG_ENTRIES = 1000;
const logs: string[] = [];
function log(message: string) {
    logs.push(message);
    if (logs.length > MAX_LOG_ENTRIES) {
        logs.shift(); // Remove oldest
    }
}
```

**Rationale**: Memory exhaustion causes crashes. Bounded structures guarantee predictable memory usage.

---

### Rule 4: Function Size Limit

**Requirement**: No function shall exceed **60 lines** (excluding blank lines and comments).

```typescript
// ❌ VIOLATION: 200-line function (decompose it)
async function handleRequest(req: Request): Promise<Response> {
    // ... 200 lines of mixed concerns ...
}

// ✅ COMPLIANT: Focused functions
async function handleRequest(req: Request): Promise<Response> {
    const validated = validateRequest(req);      // 20 lines
    const processed = processRequest(validated); // 25 lines
    return formatResponse(processed);            // 15 lines
}
```

**Rationale**: Functions that fit on one screen can be fully comprehended. Cognitive load causes bugs.

---

### Rule 5: Assertion Density

**Requirement**: Critical functions MUST have at least **2 assertions** checking invariants.

```typescript
// ❌ VIOLATION: No invariant checks
function divideResources(total: number, groups: number): number[] {
    return Array(groups).fill(total / groups);
}

// ✅ COMPLIANT: Assertions verify preconditions
function divideResources(total: number, groups: number): number[] {
    console.assert(total >= 0, `[NASA] total must be non-negative: ${total}`);
    console.assert(groups > 0, `[NASA] groups must be positive: ${groups}`);
    console.assert(Number.isFinite(total / groups), '[NASA] Division must produce finite result');
    
    return Array(groups).fill(total / groups);
}
```

**For production code**, use a utility that logs but doesn't crash:

```typescript
import { nasaAssert } from '../shared/nasaAssert';

function divideResources(total: number, groups: number): number[] {
    nasaAssert(total >= 0, 'total must be non-negative', { total });
    nasaAssert(groups > 0, 'groups must be positive', { groups });
    // ...
}
```

**Rationale**: Assertions document invariants and catch impossible states early.

---

### Rule 6: Minimal Variable Scope

**Requirement**: Declare variables at the **smallest possible scope**. Prefer `const` over `let`.

```typescript
// ❌ VIOLATION: Variable declared too early
let result: string;
// ... 50 lines of code ...
result = compute();

// ✅ COMPLIANT: Declare at point of use
const result = compute();
```

**Rationale**: Wide scope increases the chance of accidental modification or stale reads.

---

### Rule 7: Explicit Return Handling

**Requirement**: Check all function return values. Use `void` for intentional fire-and-forget.

```typescript
// ❌ VIOLATION: Ignored return value (is this intentional?)
fs.writeFile(path, data);

// ✅ COMPLIANT: Explicit handling
await fs.writeFile(path, data); // Awaited

// ✅ COMPLIANT: Intentional fire-and-forget
void telemetry.track('event'); // Explicitly ignored
```

**Rationale**: Ignored errors cascade into larger failures. Explicit `void` signals intent.

---

### Rule 8: Limited Nesting Depth

**Requirement**: Maximum **4 levels** of nesting (if/for/while/try).

```typescript
// ❌ VIOLATION: 6 levels deep
if (a) {
    for (const x of items) {
        if (x.valid) {
            try {
                if (x.type === 'A') {
                    for (const y of x.children) { // Level 6
                        // ...
                    }
                }
            }
        }
    }
}

// ✅ COMPLIANT: Extract to functions
if (a) {
    for (const x of items) {
        if (x.valid) {
            processValidItem(x); // Complexity moved to separate function
        }
    }
}
```

**Rationale**: Deep nesting obscures logic flow and increases bug density.

---

### Rule 9: Defensive Property Access

**Requirement**: Use optional chaining (`?.`) and nullish coalescing (`??`) for object access.

```typescript
// ❌ VIOLATION: Assumes structure exists
const name = config.user.profile.name;

// ✅ COMPLIANT: Defensive access with fallback
const name = config?.user?.profile?.name ?? 'Unknown';
```

**Rationale**: Runtime null/undefined errors are the #1 cause of JavaScript crashes.

---

### Rule 10: Strict Compilation

**Requirement**: Enable all available compiler warnings. Treat warnings as errors in CI.

**TypeScript tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Rationale**: Compiler warnings often indicate real bugs. Ignoring them accumulates risk.

---

## Compliance Checklist

Before committing code in mission-critical projects, verify:

- [ ] **R1**: All recursive functions have `maxDepth` parameter
- [ ] **R2**: All `while` loops have iteration counters
- [ ] **R3**: All arrays/maps have maximum size limits
- [ ] **R4**: No function exceeds 60 lines
- [ ] **R5**: Critical functions have ≥2 assertions
- [ ] **R6**: Variables declared at smallest scope
- [ ] **R7**: All returns checked or explicitly `void`
- [ ] **R8**: Maximum 4 levels of nesting
- [ ] **R9**: Optional chaining on object access
- [ ] **R10**: No compiler warnings

---

## Quick Reference

| Rule | Check | Fix Pattern |
|------|-------|-------------|
| R1 | `function.*\(.*\).*{` + recursion | Add `maxDepth = 10` param |
| R2 | `while\s*\(` | Add `&& iterations++ < MAX` |
| R3 | `push\(` without bounds | Add `if (arr.length > MAX)` |
| R4 | Function > 60 lines | Extract helper functions |
| R5 | No `assert` in function | Add `nasaAssert()` calls |
| R6 | `let` used | Convert to `const` if possible |
| R7 | Unchecked return | Add `await` or `void` |
| R8 | Deep nesting | Extract to functions |
| R9 | `obj.prop.prop` | Use `obj?.prop?.prop ?? default` |
| R10 | tsc warnings | Fix or explicitly suppress |

---

## Integration Points

- **Builder Agent**: Applies these rules during code generation
- **Validator Agent**: Checks for rule violations during review
- **Code Review**: Use checklist for PR review
- **CI Pipeline**: Enforce via linting rules

## Severity Levels

| Rules | Severity | Enforcement |
|-------|----------|-------------|
| R1, R2, R3 | 🔴 Critical | Block merge |
| R4, R5, R8 | 🟠 High | Require justification |
| R6, R7, R9, R10 | 🟡 Medium | Warning |

---

*"The rules act like the seat belt in your car: initially they are perhaps a little uncomfortable, but after a while their use becomes second-nature and not using them becomes unimaginable."* — Gerard Holzmann, NASA/JPL
