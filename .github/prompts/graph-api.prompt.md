# Microsoft Graph API Integration

**Purpose**: Implement a correct, production-ready Microsoft Graph API integration with proper auth, error handling, and pagination
**Domain**: Microsoft 365, Graph API, M365 services
**Duration**: 15-30 minutes depending on scope
**Output**: Auth layer + typed Graph client + endpoint implementations + error handling

---

## Workflow

4 steps to a solid Graph integration:

1. **Scope Planning** — least-privilege scope selection
2. **Auth Layer** — token acquisition with silent-first pattern
3. **Client Implementation** — typed fetch wrapper + error handling + pagination
4. **Endpoint Integration** — specific M365 service endpoints

---

## Step 1: Scope Planning

Before writing any code, identify required scopes:

**Show this table and ask the user to select only what they need:**

| Service | Read Scope | Write Scope |
| ------- | ---------- | ----------- |
| User profile | `User.Read` | — |
| Other users' profiles | `User.ReadBasic.All` | — |
| Presence | `Presence.Read` | — |
| Email | `Mail.Read` | `Mail.Send` |
| Calendar | `Calendars.Read` | `Calendars.ReadWrite` |
| People/contacts | `People.Read` | — |
| Groups | `Group.Read.All` | — |
| SharePoint/OneDrive | `Sites.Read.All` | `Files.ReadWrite.All` |
| Tasks (To Do) | `Tasks.Read` | `Tasks.ReadWrite` |

**Rule**: Start with `User.Read` only. Add scopes incrementally as features are enabled.

---

## Step 2: Auth Layer

Generate the authentication module (`src/graph/auth.ts`):

```typescript
import * as vscode from 'vscode';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0';

export async function getGraphToken(
    scopes: string[],
    options: { createIfNone?: boolean } = {}
): Promise<string | null> {
    try {
        const session = await vscode.authentication.getSession(
            'microsoft',
            scopes,
            { createIfNone: options.createIfNone ?? false }
        );
        return session?.accessToken ?? null;
    } catch {
        return null;
    }
}

export async function requireGraphToken(scopes: string[]): Promise<string> {
    const token = await getGraphToken(scopes, { createIfNone: true });
    if (!token) throw new Error('Microsoft authentication required');
    return token;
}
```

---

## Step 3: Graph Client

Generate the typed fetch wrapper (`src/graph/client.ts`):

```typescript
export class GraphError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = 'GraphError';
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function graphGet<T>(token: string, path: string): Promise<T> {
    const url = path.startsWith('http') ? path : `${GRAPH_ENDPOINT}${path}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') ?? '5');
        await sleep(retryAfter * 1000);
        return graphGet<T>(token, path);
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new GraphError(response.status, body.error?.message ?? `Graph error ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export async function* graphGetAll<T>(token: string, path: string): AsyncGenerator<T[]> {
    let url: string | undefined = `${GRAPH_ENDPOINT}${path}`;
    while (url) {
        const page = await graphGet<{ value: T[]; '@odata.nextLink'?: string }>(token, url);
        yield page.value;
        url = page['@odata.nextLink'];
    }
}
```

---

## Step 4: Endpoint Implementations

Generate typed wrappers for each required endpoint:

```typescript
export interface GraphUser {
    id: string;
    displayName: string;
    mail: string;
    jobTitle?: string;
}

export async function getMe(token: string): Promise<GraphUser> {
    return graphGet<GraphUser>(token, '/me?$select=id,displayName,mail,jobTitle');
}

export async function getPresence(token: string): Promise<{ availability: string; activity: string }> {
    return graphGet(token, '/me/presence');
}

// Add additional typed functions for each required endpoint
```

**Key patterns:**
- Use `$select` to fetch only required fields (performance + minimal permissions)
- Use `$filter` and `$top` to limit results
- Use `/delta` endpoints for sync scenarios

---

## Error Handling in UI Code

```typescript
try {
    const token = await requireGraphToken(['User.Read', 'Presence.Read']);
    const presence = await getPresence(token);
    // use presence data
} catch (err) {
    if (err instanceof GraphError) {
        if (err.statusCode === 403) {
            vscode.window.showWarningMessage('Additional permissions required for presence data');
        } else if (err.statusCode === 401) {
            vscode.window.showErrorMessage('Microsoft session expired. Please sign in again.');
        }
    }
}
```

---

## Validation Checklist

- [ ] Minimum scopes only (identified in Step 1)
- [ ] Silent auth first (`createIfNone: false`), interactive only on user action
- [ ] v1.0 endpoint used throughout (`/v1.0`, not `/beta`)
- [ ] `$select` used to limit fields on all GET requests
- [ ] Pagination handled where relevant (user lists, mail, events)
- [ ] 429 rate limit handling with `Retry-After` header
- [ ] `GraphError` used for typed error handling in UI code
- [ ] No tokens logged or shown in output

---

## Sample

User: "/graphAPI"

Alex:
1. Asks: Which M365 services do you need? (shows scope table)
2. [After selection] Explains minimum scope set
3. Generates `src/graph/auth.ts` — silent-first token acquisition
4. Generates `src/graph/client.ts` — typed fetch, rate limit handling, pagination
5. Generates typed endpoint functions for selected services
6. Shows error handling patterns for each scope
7. Runs through validation checklist

**Cross-reference**: `.github/instructions/microsoft-graph-api.instructions.md`
