# Security and Privacy Audit (Issue #15)

## Scope reviewed

- Expo Router screens in `app/`
- Shared components in `components/`
- Expo app configuration in `app.json`
- Dependencies in `package.json` / `package-lock.json`

## Threat model summary

- **Sensitive flows:** live audio playback via remote HTTPS stream, in-app navigation, static informational content.
- **Data exposure points:** remote stream URL, runtime error logging, dependency supply chain.
- **Current data storage:** no authentication/session storage and no local persistence of sensitive user data in app code.

## Data inventory

| Data | Source | Storage | Sensitivity | Notes |
| --- | --- | --- | --- | --- |
| FM stream endpoint | App bundle constant | Memory only | Low | Hardened to remove tracking query parameters. |
| Playback status and errors | Runtime state | Memory only | Low | Not persisted across launches. |
| User contact/info text shown on home screen | Static bundle content | Memory/render only | Low | No form capture implemented. |

## Findings and remediation

### MEDIUM (fixed): Third-party tracking parameter in bundled stream URL

- **Location:** `components/AudioPlayer.tsx`
- **Risk:** Bundling `_ga` query values in the stream URL can leak persistent analytics identifiers across all clients.
- **Remediation:** Replaced URL with a canonical endpoint and added runtime URL hardening:
  - Require `https:` transport.
  - Strip `_ga` query parameter before playback.
  - Show a user-visible playback error when stream initialization fails.

### Dependency review results (release-blocking)

- **Check performed:** `npm audit --omit=dev`
- **Result:** High/Critical advisories exist in current Expo/React Native dependency tree.
- **Examples from current audit output:** `shell-quote` (critical), `expo` (high), `react-native` (high), and transitive tooling packages such as `@expo/cli` and `postcss` (high).
- **Status:** **Release blocker until addressed.**
- **Tracking:** Keep this blocker open under issue #15 and do not cut a production release until the dependency upgrade/remediation milestone is completed.
- **Required action before release:** Upgrade to dependency versions that resolve advisories (likely via Expo SDK / React Native upgrade path) and re-run audit to confirm no unresolved High/Critical issues remain.

## Configuration and permissions review

- `app.json` currently requests only iOS `UIBackgroundModes: ["audio"]`.
- No additional dangerous Android/iOS permissions were added in app config.
- Background audio mode is justified by FM playback behavior.

## Accepted risks

- Static informational tabs currently do not collect user input or store personal data.
- No deep-link driven external navigation path is implemented in the current app screens.

## Release verification checklist

1. Run `npm run quality` and ensure it passes.
2. Re-run `npm audit --omit=dev` and confirm no unresolved High/Critical vulnerabilities.
3. Manually verify FM playback:
   - Stream starts/stops normally.
   - A non-HTTPS stream URL (temporary local test by changing `FM_STREAM.url` to `http://...`) is rejected with a user-visible error message.
   - Network/stream unavailability still surfaces a user-visible error message.
4. Confirm no secrets are committed and no tokens/credentials are logged or persisted.
