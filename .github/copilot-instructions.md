# Workout Tracker — Frontend Coding Conventions

## Project Structure

```
src/
├── api/                 — API layer (entity-specific modules)
│   ├── apiClient.ts     — Base HTTP client with auth
│   ├── types.ts         — Shared API types (ApiException, PaginatedResponse)
│   ├── exercises.ts     — Exercise API functions
│   └── tags.ts          — Tag API functions
├── components/          — UI components (feature-based folders)
│   ├── AppRouter/       — Route definitions
│   ├── authentication/  — Auth context, reducer, hooks, manager
│   ├── Button/          — Reusable UI components
│   ├── Dashboard/       — Feature pages
│   ├── ExerciseLibrary/ — Feature pages (with nested sub-components)
│   ├── Layout/          — App shell / main layout
│   ├── LoginPage/       — Login page
│   └── ProtectedLayout/ — Auth guard wrapper
├── config/              — App configuration
│   └── queryClient.ts   — TanStack Query client setup
├── hooks/               — Custom hooks (shared across features)
│   ├── useExercises.ts  — Exercise query hooks
│   └── useTags.ts       — Tag query hooks
├── types/               — Shared TypeScript type definitions (types used by more than a file)
├── utils/               — Utility functions
├── assets/              — Static assets (images, icons)
├── index.css            — Global styles (CSS variables, resets)
├── main.tsx             — App entry point (React root, providers)
└── vite-env.d.ts        — Vite type declarations
```

## Component Conventions

### File Organization
- **One component per folder** — folder name is the component name
- **Entry point**: always `index.tsx` (not `ComponentName.tsx`)
- **Styles**: co-located `style.scss` in the same folder
- **Sub-components**: nested folders under parent (e.g., `ExerciseLibrary/ExerciseTable/`)
- **Related config**: co-located (e.g., `tableConfiguration.tsx` next to the table component)

### Component Pattern
- **Functional components only** (no class components)
- **Default export** for components
- **Arrow function** syntax

```tsx
import './style.scss';

const MyComponent = ({ title, onAction }: MyComponentProps) => {
  return <div className="my-component">{title}</div>;
};

export default MyComponent;
```

### Props
- Define props as a `type` (not `interface`) above the component
- Destructure props in the function signature

```tsx
type MyComponentProps = {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
};
```

## TypeScript Conventions

- **Strict mode** enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- **Always use `type`** (not `interface`) for object shapes and props
- **Type files**: `src/types/` folder, named `kebab-case.type.tsx` (e.g., `userData.type.tsx`)
- **Export types** as named exports
- **Target**: ES2020, JSX: `react-jsx` (auto-import, no `import React`)

## Styling

- **SCSS** (Sass) — no CSS Modules, no Tailwind, no styled-components
- **Class naming**: kebab-case (e.g., `.exercise-table`, `.menu-list`, `.login-fields-container`)
- **BEM-inspired** nesting within component scope
- **One `style.scss` per component** folder — imported directly: `import './style.scss'`
- **Global styles** in `src/index.css` — CSS custom properties on `:root`, resets, base typography
- **Layout**: CSS Flexbox

## State Management

- **Auth state**: React Context + `useReducer` (in `components/authentication/`)
- **Local component state**: `useState` 
- **Server state**: TanStack Query (React Query)
- **Context pattern**: Provider component wraps app, custom `useAuth()` hook for consumption
- **Action types**: String constants in separate file (`reducerActionTypes.tsx`)
- **Reducer**: Switch-case pattern, throws on unknown action

### TanStack Query

- **QueryClient config**: `src/config/queryClient.ts` — 5min staleTime, 1 retry, refetchOnWindowFocus
- **API layer**: `src/api/` — entity-specific modules (e.g., `exercises.ts`, `tags.ts`)
- **API client**: `src/api/apiClient.ts` — centralized fetch wrapper with auth injection, error handling
- **Hooks**: `src/hooks/use[Entity].ts` — query hooks per entity
- **No mutations yet** — CRUD mutations to be added in future tasks

#### Query Key Convention
```typescript
// Pattern: [entity, ...scope/filters]
['exercises', { search, tags, page }]  // list with filters
['exercise', exerciseId]                // single entity
['tags', { type }]                      // filtered list
```

#### Query Key Factories
Always use factories for consistency:
```typescript
export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (filters?) => [...exerciseKeys.lists(), filters] as const,
  details: () => [...exerciseKeys.all, 'detail'] as const,
  detail: (id) => [...exerciseKeys.details(), id] as const,
};
```

#### API Module Pattern
```typescript
// src/api/entity.ts
import { apiClient } from './apiClient';

export type Entity = { id: string; name: string };
export type EntityFilters = { search?: string };

export const getEntities = async (filters?: EntityFilters) => {
  return apiClient.get<Entity[]>('/entity', { params: filters });
};
```

#### Hook Pattern
```typescript
// src/hooks/useEntity.ts
import { useQuery } from '@tanstack/react-query';
import { getEntities, EntityFilters } from '../api/entity';

export const useEntities = (filters?: EntityFilters) => {
  return useQuery({
    queryKey: entityKeys.list(filters),
    queryFn: () => getEntities(filters),
  });
};
```

#### Stale Time Guidelines
- Default: 5 minutes (QueryClient config)
- Reference data (tags, categories): 10 minutes — override in hook
- Real-time data: 0 or use polling
- Static data: `Infinity`

## Routing

- **React Router v6** with `createBrowserRouter` + `createRoutesFromElements`
- **Nested routes**: `<Route element={<Layout />}>` wraps child routes
- **Protected routes**: `ProtectedLayout` component checks auth, redirects to `/login` if not authenticated
- **Route definitions**: in `components/AppRouter/index.tsx`

## API Calls

- **TanStack Query hooks** for all server state — use `useQuery` for fetching
- **API client**: `src/api/apiClient.ts` — centralized fetch wrapper
  - Auto-injects JWT Bearer header from `localStorage.requestToken`
  - Handles 401 → auto-logout and redirect to `/login`
  - Typed errors with `ApiException` class
  - Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- **API base URL**: proxied through Vite (`/api` → `https://localhost:7164`)
- **Legacy**: `authenticatedFetch()` in `utils/requestUtils.tsx` (being phased out)
- **Token storage**: `localStorage` (`requestToken`, `accessToken`)
- **JWT decoding**: `jwt-decode` library

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Component folders | PascalCase | `ExerciseLibrary/`, `LoginPage/` |
| Component files | `index.tsx` | Always `index.tsx` |
| Style files | `style.scss` | Always `style.scss` |
| Type definition files | kebab-case.type.tsx | `userData.type.tsx` |
| API modules | camelCase.ts | `exercises.ts`, `tags.ts`, `apiClient.ts` |
| Query hooks | camelCase.ts | `useExercises.ts`, `useTags.ts` |
| Other hooks | camelCase.tsx | `useAuth.tsx` |
| Utility files | camelCase.tsx | `requestUtils.tsx`, `textUtils.tsx` |
| Config files | camelCase.ts | `queryClient.ts` |
| Reducer files | camelCase.tsx | `reducer.tsx`, `reducerActions.tsx` |
| Test files | `index.test.tsx` | Co-located in component folder |

## Import Conventions

- **Relative imports only** — no path aliases configured
- **No barrel exports** (no `index.ts` re-exports from folders)
- **Direct file imports**: `import { type } from '../../types/file.type'`
- Components imported by folder (resolved to `index.tsx`): `import Dashboard from '../Dashboard'`

## Custom Hooks

- Named with `use` prefix, camelCase
- **Auth hooks**: Located in component feature folders (e.g., `authentication/useAuth.tsx`)
- **Query hooks**: Located in `src/hooks/` (e.g., `useExercises.ts`, `useTags.ts`)
- Export query key factories alongside hooks for cache invalidation

```tsx
// Auth hook example
const useAuth = () => useContext(AuthDataContext) as AuthDataContextType;
export default useAuth;
```

```tsx
// Query hook example
export const exerciseKeys = { /* ... */ };
export const useExercises = (filters?: ExerciseFilters) => {
  return useQuery({
    queryKey: exerciseKeys.list(filters),
    queryFn: () => getExercises(filters),
  });
};
```

## Utility Functions

- Located in `src/utils/`
- **Named exports** (not default exports)
- camelCase function names

```tsx
export const stringIsNullUndefOrEmpty = (str: string | null | undefined) =>
  str === null || str === undefined || str.trim().length === 0;
```

## Linting & Formatting

- **ESLint**: `eslint:recommended` + `@typescript-eslint/recommended` + `react-hooks/recommended`
- **Single quotes enforced** (`@stylistic/ts/quotes`)
- **Zero warnings** policy (`--max-warnings 0`)
- **Prettier** installed (defaults), integrated via `prettier-eslint`
- **React Fast Refresh** validation enabled

## Package Manager

- **Yarn** (yarn.lock, not package-lock.json)
- `yarn dev` — start Vite dev server
- `yarn build` — TypeScript check + Vite build
- `yarn lint` — ESLint

## Build & Dev Tooling

- **Vite** with `@vitejs/plugin-react`
- Dev server proxy: `/api` → `https://localhost:7164` (strips `/api` prefix)
- TypeScript `noEmit: true` (Vite handles compilation)

## Playwright MCP & Test Authentication

**Purpose**: Enable autonomous UI validation using Playwright MCP tools after making UI changes.

### CRITICAL: Backend runs on HTTPS port 7164
Test auth endpoint: `https://localhost:7164/api/testauth/{role}`

### Correct MCP Authentication Pattern
```typescript
// 1. Navigate to test auth endpoint (HTTPS port 7164!)
await page.goto('https://localhost:7164/api/testauth/admin');

// 2. Extract token from JSON response
const tokenData = await page.evaluate(() => {
  return JSON.parse(document.body.textContent);
});
const token = tokenData.token;

// 3. Navigate to frontend and inject token
await page.goto('http://localhost:5173');
await page.evaluate((t) => {
  localStorage.setItem('requestToken', t);
}, token);

// 4. MUST reload page for auth context to initialize
await page.reload();

// 5. Navigate to target page
await page.goto('http://localhost:5173/exercise-library');

// 6. Wait for content to load
await page.waitForTimeout(2000);

// 7. Take screenshot or verify
await page.screenshot({ fullPage: true, path: 'check.png' });
```

### Available Test Roles
- `Trial` - Limited access
- `User` - Regular authenticated user
- `ContentModerator` - Can moderate content
- `Admin` - Full administrative access

### Important Caveats
- **Theme rendering**: Playwright MCP may show light theme when app uses dark theme
- **Auth timing**: Components checking `userLoaded` may not render immediately
- **Always verify in real browser** after Playwright check for accurate visual confirmation
- **Expected errors**: Tags API 404 is normal in development

### When to Use
- Quick check after UI/styling changes
- Verify component rendering
- Check for obvious layout issues
- Take screenshots for review

### When NOT to Use
- Final visual approval (use real browser)
- Exact color/theme verification
- Auth flow testing

**Documentation**: See `/tests/README.md` for detailed information.

**Security**: Development-only, requires `TestAuthSettings.Enabled: true`, returns 404 in production.

## Tech Stack
- React 19, TypeScript 5
- React Router v6
- TanStack Query v5 (React Query) — server state management
- TanStack Table v8
- SCSS
- Vite 8
- Google OAuth (`@react-oauth/google`)
- jwt-decode
- ESLint + Prettier

## Comments (important)
use comments only when the code logic + naming cannot clearly convey the intent. Avoid redundant comments that restate what the code does. Focus comments on the "why" and any non-obvious implementation details.

## Avoid creating barell files (index.ts) for folders. Import directly from the file to maintain clear dependencies and avoid circular imports.

## Don't create documentation unless explicitly requested. Offer to update documentation on these copilot instructions.