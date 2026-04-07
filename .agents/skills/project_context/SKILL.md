# Beyanhane Auth Project Context & Standards

## Project Overview
`beyanhane-auth` is a TypeScript-based authentication library designed with a modular architecture to be used in Next.js applications. It follows a monorepo structure (using workspaces) divided into several core and specialized packages.

## Package Architecture

- **`@beyanhane-auth/core`**: The foundational package containing core logic, interfaces, and shared utilities. All other packages depend on this.
- **`@beyanhane-auth/adapters`**: Contains database and infrastructure adapters (e.g., Prisma, Drizzle, etc.).
- **`@beyanhane-auth/providers`**: Implementation of various auth providers (e.g., Google, GitHub, Credentials).
- **`@beyanhane-auth/react`**: Frontend-specific logic, hooks (e.g., `useSession`), and context providers for React/Next.js applications.

## Technical Stack & Standards

- **Language**: TypeScript
- **Build Tool**: `tsup` for fast, tree-shakeable ESM/CJS builds.
- **Testing**: `vitest`. 
    - Use `node` environment for core/adapters/providers.
    - Use `happy-dom` environment for the `react` package.
- **Next.js Integration**: The library is optimized for Next.js, supporting both Client and Server Components where applicable.
- **Monorepo Management**: NPM Workspaces.

## Development Patterns

- **Barrel Exports**: Each package should have a primary `src/index.ts` that exports its public API.
- **Type Safety**: Prioritize strict type definitions within `@beyanhane-auth/core`.
- **Peer Dependencies**: React-related packages must list `react` and `react-dom` as peer dependencies to avoid multiple versions in the user's project.
- **Clean Code**: Follow English naming conventions for code, but Turkish developer communication/comments are acceptable as per user preference (though standardizing on English for code-level documentation is often preferred).

## Testing Standards
Refer to the `project_testing_standards` skill for detailed instructions on writing and maintaining Vitest unit tests in this codebase.
