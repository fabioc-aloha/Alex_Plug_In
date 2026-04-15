---
sem: 1
description: Generate Zustand stores with TypeScript, devtools, and persistence patterns
application: "When building MCP servers or AI tool integrations"
agent: Frontend
---

# /create-store - Zustand State Management

Generate type-safe Zustand stores with devtools integration and optional persistence.

## Store Pattern

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface StoreState {
  // State
  items: Item[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        addItem: (item) =>
          set((state) => {
            state.items.push(item);
          }),

        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((i) => i.id !== id);
          }),

        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        reset: () => set(initialState),
      })),
      { name: 'store-name' }
    ),
    { name: 'StoreName' }
  )
);
```

## Middleware Decision Tree

| Need | Middleware | Import |
| ---- | ---------- | ------ |
| Debug in React DevTools | `devtools` | `zustand/middleware` |
| Persist to localStorage | `persist` | `zustand/middleware` |
| Immutable updates | `immer` | `zustand/middleware/immer` |
| Async actions | None needed | Built-in |

## Selectors Pattern

```typescript
// Fine-grained selectors prevent unnecessary re-renders
export const useItems = () => useStore((state) => state.items);
export const useIsLoading = () => useStore((state) => state.isLoading);

// Derived selectors
export const useItemCount = () => useStore((state) => state.items.length);
export const useItemById = (id: string) =>
  useStore((state) => state.items.find((i) => i.id === id));
```

## Async Actions Pattern

```typescript
fetchItems: async () => {
  set({ isLoading: true, error: null });
  try {
    const items = await api.getItems();
    set({ items, isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
},
```

## Input Required

Provide:

1. **Store name** — What domain does this manage?
2. **State shape** — What data needs to be stored?
3. **Actions** — What mutations are needed?
4. **Persistence** — Should it survive page refresh?

I'll generate a complete, type-safe store with appropriate middleware.
