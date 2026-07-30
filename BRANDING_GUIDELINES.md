# SPHF Mobile Branding Guidelines

This document defines the production branding system for SPHF Mobile and Swahilipot FM.

## Brand philosophy

SPHF Mobile presents two connected brands:

- SPHF (Swahilipot Hub Foundation): trusted, community-first, and educational.
- Swahilipot FM: energetic, media-forward, and live-content focused.

The FM experience should feel modern and expressive while staying visually compatible with SPHF foundations.

## Theme architecture

Use the centralized theme modules under `theme/`:

- `theme/colors.ts`: SPHF and FM color tokens plus app light/dark semantic colors.
- `theme/typography.ts`: shared typography scale and FM-specific typography presets.
- `theme/spacing.ts`: reusable spacing and corner radius tokens.
- `theme/shadows.ts`: shared shadow presets.
- `theme/branding.ts`: brand-level configuration including icon references and asset pointers.
- `theme/index.ts`: barrel export for all theme modules.

### Developer rule

Developers should import tokens from `theme/` (or `constants/Colors.ts` for existing Themed utilities) instead of creating new hardcoded color values.

## Color usage rules

### SPHF colors

- Use `appColors` semantic tokens for general UI surfaces and text.
- Use `sphfColors.primary` for primary actions, links, and navigation accents.
- Use `sphfColors.secondary` and `sphfColors.accent` for supportive highlights only.
- Use `sphfColors.status` for success/warning/error/info messaging.

### Swahilipot FM colors

- Use `swahilipotFmColors.player.*` for player containers, badges, and media controls.
- Use `swahilipotFmColors.button.*` for FM action buttons.
- Use `swahilipotFmColors.accent` for live/error emphasis on FM screens.

## Typography rules

- Base typography comes from `typography` scale tokens.
- FM-specific labels, badges, and hero title should use `fmTypography` presets.
- Avoid ad hoc font sizes when a scale token exists.

## Spacing and elevation rules

- Use `spacing` tokens for gaps and paddings.
- Use `radius` tokens for border radius values.
- Use `shadows.soft` for elevated floating controls.

## Icon usage rules

- App launcher, adaptive icon foreground, and favicon live in `assets/icons/`.
- FM playback icon names are centralized in `swahilipotFmBranding.icons`.
- Keep icon metaphors consistent: `play`, `pause`, `stop`, and `podcast/radio` should not be remapped without design review.

## Asset structure and naming conventions

Use the following structure:

- `assets/branding/sphf/`: SPHF splash and brand-level app visuals.
- `assets/branding/swahilipot-fm/`: FM campaign/brand visuals.
- `assets/icons/`: launcher/adaptive/web icon assets.
- `assets/logos/sphf/`: SPHF logo files.
- `assets/logos/swahilipot-fm/`: FM logo files.

Naming conventions:

- Use lowercase kebab-case filenames.
- Include role suffixes where relevant: `-primary`, `-foreground`, `-placeholder`.
- Prefer PNG for app/runtime bitmap assets unless transparency/vector workflow requires alternatives.

## Placeholder policy

When official brand files are unavailable:

- Keep placeholders in the same path and filename used by runtime code/config.
- Add a README in the relevant asset folder documenting which files are placeholders.
- Replace placeholders in place when official exports are approved.

Current placeholders:

- `assets/logos/swahilipot-fm/fm-logo-placeholder.png`
- `assets/icons/app-icon.png`
- `assets/icons/adaptive-foreground.png`
- `assets/icons/favicon.png`
- `assets/branding/sphf/splash.png`

## Expo configuration alignment

`app.json` currently references branded paths:

- `expo.icon` -> `assets/icons/app-icon.png`
- `expo.android.adaptiveIcon.foregroundImage` -> `assets/icons/adaptive-foreground.png`
- `expo.web.favicon` -> `assets/icons/favicon.png`
- `expo-splash-screen.image` -> `assets/branding/sphf/splash.png`

If files are replaced, keep dimensions/platform requirements compatible with Expo defaults.
