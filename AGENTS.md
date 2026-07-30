# AGENTS.md

This file defines repository-wide guidance for AI coding agents working on SPHF
Mobile.

## Project overview

SPHF Mobile is a TypeScript Expo/React Native application. Expo Router screens live
under `app/`, reusable application code lives under `components/`, and static assets
live under `assets/`. The app targets Android, iOS, and web.

## Required workflow

1. Inspect related screens, components, and configuration before editing.
2. Make the smallest complete change that addresses the task.
3. Reuse existing components, hooks, constants, and styling patterns.
4. Run `npm run quality` before considering a code change complete.
5. Update relevant documentation when commands, setup, architecture, or behavior
   changes.

## Commands

```bash
npm ci             # Install locked dependencies
npm start          # Start Expo
npm run quality    # ESLint, Prettier check, and TypeScript validation
npm run format     # Apply supported formatting and lint fixes
```

## Engineering conventions

- Keep TypeScript strict; do not use `any` or unsafe casts to bypass errors.
- Use Expo Router for navigation and preserve the route conventions under `app/`.
- Keep reusable UI and state outside route files when it belongs in `components/`.
- Support light/dark themed primitives already provided by `components/Themed`.
- Preserve accessibility labels and roles for interactive controls.
- Handle asynchronous loading and errors explicitly; do not silently swallow failures.
- Keep platform behavior consistent unless requirements explicitly call for a
  platform-specific implementation.
- Do not add dependencies when an existing package or platform API is sufficient.
- When dependencies change, commit the corresponding `package-lock.json` update.

## Repository safety

- Never commit secrets, credentials, personal data, `.env` files, or local machine
  configuration.
- Do not edit generated `.expo`, `dist`, `node_modules`, or native build output.
- Do not rewrite or remove unrelated work.
- Changes to `main` must go through a pull request, pass CI, and receive one approval.

## Documentation

- Keep `README.md` focused on project setup and common commands.
- Keep detailed device-running guidance in `docs/RUNNING.md`.
- Update `docs/README.md` when screenshots are added, renamed, or removed.
- Follow `CONTRIBUTING.md` for pull request expectations.
