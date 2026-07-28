# Contributing to SPHF Mobile

Thank you for helping improve SPHF Mobile. Contributions should be focused, tested,
and consistent with the existing Expo and React Native architecture.

## Before you begin

- Search existing issues and pull requests to avoid duplicating work.
- Open an issue for substantial features or behavior changes before implementation.
- Never commit credentials, tokens, personal data, or local environment files.

## Local setup

1. Fork or clone the repository.
2. Create a descriptive branch from the latest `main`:

   ```bash
   git switch main
   git pull --ff-only
   git switch -c feature/short-description
   ```

3. Install dependencies and start Expo:

   ```bash
   npm ci
   npm start
   ```

See [README.md](README.md) and [docs/RUNNING.md](docs/RUNNING.md) for complete setup
and troubleshooting instructions.

## Development standards

- Use TypeScript and keep strict type checking enabled.
- Follow the existing Expo Router, component, naming, and styling patterns.
- Keep components focused and reuse existing components and helpers before adding new
  abstractions.
- Preserve Android, iOS, and web behavior unless the change is intentionally
  platform-specific.
- Add or update documentation when setup, commands, or user-visible behavior changes.
- Update `package-lock.json` whenever dependencies change.
- Do not commit generated `.expo`, `dist`, native build, or dependency directories.

Run the same quality checks used by CI before committing:

```bash
npm run quality
```

Use `npm run format` to apply supported automatic fixes.

## Commit and pull request guidelines

- Write concise, imperative commit subjects, such as `Add FM schedule loading state`.
- Keep unrelated changes in separate pull requests.
- Explain what changed, why it changed, and how it was verified.
- Include screenshots or recordings for visible UI changes.
- Link related issues with `Closes #123` when applicable.
- Resolve review conversations and keep the branch current with `main`.

## Review and merge policy

The `main` branch is protected. Every change must:

1. Be submitted through a pull request.
2. Pass the required code-quality workflow.
3. Receive at least one approving review from someone other than the pull request
   author.

The authorized maintainer `achingachris` may merge a pull request without a separate
approval. This exception applies only through a pull request; direct pushes to `main`
remain blocked, and the code-quality workflow must pass.
