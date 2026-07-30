# SPHF Mobile

[![Code quality](https://github.com/Swahilipot-Hub-Engineering/sphf-mobile/actions/workflows/code-quality.yml/badge.svg)](https://github.com/Swahilipot-Hub-Engineering/sphf-mobile/actions/workflows/code-quality.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SPHF Mobile is an Expo and React Native app that gives the Swahilipot Hub community
access to foundation information, Swahilipot FM live audio, events, and other community
resources from one place.

## Features

- Swahilipot Hub Foundation information and initiatives
- Live Swahilipot FM streaming with persistent playback controls
- FM programming schedule
- Community events and highlights
- Responsive tab navigation for Android, iOS, and web

## Technology

- [Expo](https://expo.dev/) and React Native
- [Expo Router](https://docs.expo.dev/router/introduction/)
- TypeScript
- NativeWind and Tailwind CSS
- Expo Audio

## Prerequisites

Install the following before setting up the project:

- [Node.js](https://nodejs.org/) 20 or later
- npm 10 or later
- [Expo Go](https://expo.dev/go) on a physical Android or iOS device, or a configured
  Android emulator/iOS simulator

## Setup and installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Swahilipot-Hub-Engineering/sphf-mobile.git
   cd sphf-mobile
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Start the Expo development server:

   ```bash
   npm start
   ```

4. Scan the displayed QR code with Expo Go, or press `a`, `i`, or `w` to open the app
   on Android, iOS, or the web.

Your phone and development machine must be on the same network when using Expo Go.
For additional launch options and troubleshooting, see [docs/RUNNING.md](docs/RUNNING.md).
For security and privacy release controls, see [docs/SECURITY_PRIVACY_AUDIT.md](docs/SECURITY_PRIVACY_AUDIT.md).

## Available commands

| Command             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm start`         | Start the Expo development server                  |
| `npm run android`   | Start the app on Android                           |
| `npm run ios`       | Start the app on iOS                               |
| `npm run web`       | Start the web version                              |
| `npm run lint`      | Run ESLint and verify Prettier formatting          |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run quality`   | Run all code-quality checks used by CI             |
| `npm run format`    | Apply ESLint and Prettier fixes                    |

## Project structure

```text
app/          Expo Router screens and navigation
assets/       Images, fonts, and other static assets
components/   Reusable UI and application components
constants/    Shared application constants
docs/         Screenshots and detailed running instructions
```

## Branding system

The app uses a centralized design system and brand token architecture under `theme/`.
For color, typography, icon, and asset naming standards, see `BRANDING_GUIDELINES.md`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Changes to
`main` must be submitted through a pull request, pass the code-quality workflow, and
receive at least one approving review. Pull requests merged by the authorized
maintainer `achingachris` may bypass the review requirement, but must still pass CI.

## License

This project is available under the [MIT License](LICENSE).
