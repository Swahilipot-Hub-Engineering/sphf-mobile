# Running the App

This guide walks you through everything needed to run the SPHF mobile app locally, from installing prerequisites to opening the app on your phone.

## 1. Prerequisites

Make sure the following are installed on your machine:

| Tool | Minimum Version | Check With |
| ---- | --------------- | ---------- |
| [Node.js](https://nodejs.org/) (LTS recommended) | 20.x | `node -v` |
| npm (bundled with Node.js) | 10.x | `npm -v` |
| [Git](https://git-scm.com/) | any recent | `git --version` |

> No Android Studio or Xcode is required to run the app in development — the app runs inside the **Expo Go** client (see step 2).

## 2. Download the Expo Go App

The project runs on your physical device through **Expo Go**:

- **Android** — install [Expo Go from the Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS** — install [Expo Go from the App Store](https://apps.apple.com/app/expo-go/id982107779)

> **Important:** your phone and your computer must be connected to the **same Wi-Fi network** for Expo Go to reach the development server.

## 3. Clone the Repository

```bash
git clone git@github.com:Swahilipot-Hub-Engineering/sphf-mobile.git
cd sphf-mobile
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Start the Development Server

```bash
npm start
```

This runs `expo start` and launches the Metro bundler. A QR code will be printed in the terminal.

If you run into stale-cache issues (e.g. after switching branches or installing packages), start with a cleared cache:

```bash
npx expo start -c
```

## 6. Open the App

### On your phone (recommended)

- **Android:** open the **Expo Go** app and scan the QR code shown in the terminal.
- **iOS:** open the **Camera** app, scan the QR code, and tap the notification to open in Expo Go.

The JavaScript bundle will build on first load (this can take a minute), then the app will appear on your device. Changes you make to the code reload automatically.

### In the browser

With the dev server running, press `w` in the terminal (or visit the URL printed as "Web is waiting on", e.g. `http://localhost:8081`).

### On an emulator (optional)

If you have an Android emulator or iOS simulator set up:

- Press `a` in the terminal to open on Android
- Press `i` in the terminal to open on iOS (macOS only)

## 7. Useful Dev Server Shortcuts

While `npm start` is running:

| Key | Action |
| --- | ------ |
| `r` | Reload the app |
| `j` | Open the debugger |
| `m` | Toggle the developer menu |
| `w` | Open in web browser |
| `a` | Open on Android device/emulator |
| `?` | Show all commands |

## Settings: Clear Cache Scope

From the Settings tab, **Clear cache** removes cached app content (for example FM schedule data).

- It **does clear** temporary content-cache entries.
- It **does not clear** identity data (if added later) or essential app preferences such as theme and audio behavior.

## Troubleshooting

- **"Port 8081 is running this app in another window"** — another dev server instance is already running. Stop it (Ctrl+C) or accept the prompt to use another port.
- **"Unable to resolve module …"** — dependencies may be out of date. Run `npm install`, then restart with `npx expo start -c`.
- **QR code won't connect** — confirm your phone and computer are on the same Wi-Fi network. Some networks block device-to-device traffic; try a mobile hotspot or run `npx expo start --tunnel`.
- **Changes not showing up** — press `r` in the terminal to force a reload, or restart the server with `npx expo start -c`.
