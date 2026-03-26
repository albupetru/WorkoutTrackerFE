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
- **One component per folder** — folder name is the component name (PascalCase)
- **Entry point**: always `index.tsx` (not `ComponentName.tsx`) — this allows importing by folder name without specifying a filename
- **Styles**: co-located `style.scss` in the same folder
- **Sub-components**: components used exclusively by one parent component live inside that parent's folder, each in their own named subfolder (e.g., `ExerciseLibrary/ExerciseTable/`, `ExerciseLibrary/Pagination/`). Components shared across multiple features go in `src/components/` directly.
- **Related config**: co-located helper files (e.g., `tableConfiguration.tsx`) stay in the component folder alongside `index.tsx`

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

### Design System: Kinetic Noir

The app uses a custom dark design system called **Kinetic Noir** — near-black backgrounds, white text, with lime/yellow-green and cyan as the two accent colors. When building new components, follow the established patterns below.

#### Color Palette (CSS variables — defined in `src/index.css`)

| Variable | Value | Usage |
|---|---|---|
| `--color-background` | `#0e0e0e` | Page background |
| `--color-surface` | `#0e0e0e` | Card / surface base |
| `--color-surface-container-low` | `#131313` | Hover backgrounds, subtle fills |
| `--color-surface-container` | `#1a1a1a` | Raised containers, dropdowns |
| `--color-surface-container-high` | `#20201f` | Table header rows |
| `--color-surface-container-highest` | `#262626` | Highest elevation surface |
| `--color-surface-bright` | `#2c2c2c` | Open/active control background |
| `--color-primary` | `#f3ffca` | Hover highlights, active sort icon, accent bar |
| `--color-primary-dim` | `#beee00` | Logo, active nav link, hyperlinks |
| `--color-primary-container` | `#cafd00` | Form title accent word, gradient end |
| `--color-on-primary-fixed` | `#3a4a00` | Text on primary CTA button |
| `--color-secondary` | `#00e3fd` | Cyan — section labels, input focus border, filter clear links |
| `--color-on-surface` | `#ffffff` | Primary text |
| `--color-on-surface-variant` | `#adaaaa` | Secondary/muted text, inactive nav, placeholder |
| `--color-outline-variant` | `#484847` | Border color base |

#### Additional Raw Colors (used directly, not as variables)

| Color | Usage |
|---|---|
| `#ff7351` | Error/destructive — inline validation errors, delete button hover |
| `#006875` | Filter count badge background (teal-dark) |
| `#e8fbff` | Filter count badge text (light cyan) |
| `#4dd9ec` | Active filter button text |
| `rgba(0, 104, 117, 0.18)` | Active filter button background |
| `rgba(72, 72, 71, 0.08–0.20)` | Dividers and subtle borders (use `--color-outline-variant` at low opacity) |

#### Typography

Two font families — always reference by name, not generic fallback alone.

**Lexend** — display, headings, navigation, uppercase labels, table headers, logo, primary CTA
- Weights in use: 400, 500, 700, 800, 900
- Imported via `@fontsource/lexend`

**Manrope** — body text, descriptions, helper text, checkboxes, secondary UI
- Weights in use: 400, 500, 600, 700
- Imported via `@fontsource/manrope`
- Default app font (`font-family` on `:root` and `body`)

**Typography scale patterns:**

| Role | Font | Size | Weight | Style |
|---|---|---|---|---|
| Page title (form header) | Lexend | `3rem` | 900 | Uppercase, `letter-spacing: -0.03em` |
| Large name input | Lexend | `2rem` | 800 | `letter-spacing: -0.02em` |
| Logo | Lexend | `1.5rem` | 800 | Italic, `letter-spacing: -0.02em`, color `--color-primary-dim` |
| Nav links | Lexend | `0.875rem` | 500 | Normal case |
| Table headers | Lexend | `1rem` | 700 | Uppercase, `letter-spacing: 0.12em` |
| Exercise name (table row) | Lexend | `1rem` | 700 | Uppercase, `letter-spacing: 0.03em` |
| Section / field labels | Manrope | `12px` | 700 | Uppercase, `letter-spacing: 0.2em`, color `--color-secondary` |
| Category / badge labels | Lexend | `9–10px` | 700–800 | Uppercase, `letter-spacing: 0.10–0.14em` |
| Results count / metadata | Lexend | `11px` | 700 | Uppercase, `letter-spacing: 0.12em`, color `--color-on-surface-variant` |
| Tag chips (library table) | Lexend | `9px` | 700 | Uppercase, `letter-spacing: 0.1em` |
| Body / descriptions | Manrope | `0.875–1rem` | 400–600 | Normal |
| Subtitle under exercise name | Manrope | `10px` | 600 | Uppercase, `letter-spacing: 0.08em`, color `--color-secondary` |
| Dropdown / menu items | Lexend | `0.8rem` | 500–600 | Normal |

#### Icons

Use **Material Symbols Outlined** — imported globally via `material-symbols/outlined.css`. Reference icons with the `material-symbols-outlined` class. Common sizes: `14px`, `16px`, `18px`, `22px`, `40px`.

#### Spacing & Layout

- Top nav bar: fixed `56px` height; content area gets `margin-top: 56px`
- Sidebar: fixed `256px` width; content area gets `margin-left: 256px`
- Library content padding: `1.5rem 2rem`, max-width `1600px`
- Exercise form: max-width `56rem`, centered, padding `3rem 2rem`
- Form section gaps: `3rem` between major sections, `1.5rem` within a section

#### Border Radius

| Context | Value |
|---|---|
| Buttons, inputs, filter chips | `0.5rem` (8px) |
| Textareas, large containers | `0.75rem` (12px) |
| Avatars / circles | `50%` |
| Pill tags / rounded badges | `9999px` |
| Small tag chips (table) | `4px` |

#### Borders & Dividers

- All dividers: `1px solid rgba(72, 72, 71, 0.10–0.15)` — very subtle
- Input borders: `1px solid var(--color-outline-variant)` (`#484847`)
- Name field (form): bottom-border only — `2px solid rgba(72, 72, 71, 0.3)` — editorial, no box
- Border hover: `rgba(72, 72, 71, 0.4)`
- Active filter border: `rgba(0, 104, 117, 0.45)`

#### Shadows

- Dropdowns / overlays: `0 8px 24px rgba(0, 0, 0, 0.45)` — deep shadow
- Nav dropdown: `0 4px 16px rgba(0, 0, 0, 0.15)`
- Input focus ring (textarea): `0 0 0 1px rgba(0, 227, 253, 0.15)` with cyan border

#### Transitions

- Default duration: `0.15s` for `color`, `background`, `border-color`
- Slower: `0.2s` for `border-color`, `box-shadow` (form inputs), `opacity`
- Scale transforms: `0.15s`
- Always list transition properties explicitly — never use `transition: all`

#### Interactive Patterns

**Table rows**
- Cursor: pointer
- Hover: background → `--color-surface-container-low`; exercise name → `--color-primary` (lime); accent bar (6px × 32px vertical pill, `--color-primary`) fades from `opacity: 0.2` to `opacity: 1`

**Navigation links**
- Inactive: color `--color-on-surface-variant`
- Hover: color `--color-on-surface` + background `--color-surface-container-low`
- Active: color `--color-primary-dim` + background `--color-surface-container`

**Primary CTA button** ("Add Exercise" style)
```scss
background: linear-gradient(135deg, #f3ffca 0%, #cafd00 100%);
color: #3a4a00;
font-family: "Lexend", sans-serif;
font-weight: 900;
font-size: 11px;
text-transform: uppercase;
letter-spacing: 0.05em;
border-radius: 0.5rem;

&:hover { transform: scale(1.04); filter: brightness(1.06); }
&:active { transform: scale(0.97); }
```

**Input focus states**
- Bottom-border inputs: border-bottom → `--color-secondary` (cyan)
- Box inputs (textarea): `border-color: rgba(0, 227, 253, 0.4)` + `box-shadow: 0 0 0 1px rgba(0, 227, 253, 0.15)`

**Form section labels** — use `--color-secondary` (cyan) for all field labels and section headers

**Danger / destructive color** — `#ff7351` (coral-orange) exclusively for inline errors, delete action hover, and other destructive UI. Never use for neutral states.

**Filter count badges** — `background: #006875`, `color: #e8fbff`, `border-radius: 999px`

**Active filter state** — `background: rgba(0, 104, 117, 0.18)`, `color: #4dd9ec`, `border-color: rgba(0, 104, 117, 0.45)`

#### Scrollbars (sidebar / overflow areas)
```scss
&::-webkit-scrollbar { width: 4px; }
&::-webkit-scrollbar-track { background: transparent; }
&::-webkit-scrollbar-thumb { background: rgba(72, 72, 71, 0.4); border-radius: 2px; }
```

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