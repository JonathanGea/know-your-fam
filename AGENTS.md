# Repository Guidelines

## Project Structure & Module Organization
- `fe-client/`: Angular frontend (source in `src/`, app code in `src/app/`, styles in `src/styles.css`). Public assets live in `fe-client/public/`.
- `be-service/`: Backend placeholder. Add service code here if/when introduced.
- `docs/` and `_docs/`: Project documentation, logs, and notes.
- Root files: `README.md`, `REQUIREMENTS.md` describe goals and context.

## Build, Test, and Development Commands
- Install dependencies: `cd fe-client && npm ci`
- Run dev server: `npm start` (serves Angular app with HMR at default port).
- Build production: `npm run build` (emits to `fe-client/dist/`).
- Watch build: `npm run watch` (rebuilds on file changes).
- Unit tests: `npm test` (Jasmine/Karma).
- Optional coverage: `npx ng test --code-coverage` (outputs to `coverage/`).

## Coding Style & Naming Conventions
- Language: TypeScript (Angular 20).
- Indentation: 2 spaces; avoid tabs.
- Filenames: `kebab-case` for files; Angular components/services use standard suffixes (e.g., `family-tree.component.ts`).
- Classes/Interfaces: `PascalCase`; variables/functions: `camelCase`.
- Formatting: Prettier config lives in `fe-client/package.json`. Check/format with `npx prettier --check "fe-client/**/*"` or `--write`.
- Styling: Tailwind CSS preferred; avoid inline styles when utility classes suffice.

## Testing Guidelines
- Framework: Jasmine with Karma runner.
- Test files: `*.spec.ts` colocated with the code (e.g., `src/app/app.spec.ts`).
- Scope: Favor small, deterministic unit tests; mock DOM and services.
- Run locally: `npm test`; add coverage locally with `ng test --code-coverage`.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits encouraged (e.g., `feat:`, `fix:`, `refactor:`). History shows `feat:` usage; keep messages imperative and scoped.
- Branches: short, descriptive names (e.g., `feat/family-tree-zoom`).
- PRs: include summary, motivation, and screenshots/GIFs for UI changes; link related issues and note breaking changes. Ensure builds and tests pass.

## Security & Configuration Tips
- Do not commit secrets. Store API URLs/keys via environment-appropriate config and document usage in `docs/`.
- Validate user input and sanitize any dynamic rendering before introducing backend features in `be-service/`.
