# @frc-web-components/app

## 1.5.0

### Minor Changes

- b7754eb: Added properties to camera stream component to limit bandwidth

### Patch Changes

- Updated dependencies [b7754eb]
  - @frc-web-components/fwc@3.3.0
  - @frc-web-components/react@3.0.0

## 1.4.1

### Patch Changes

- 36c4a48: Fixed bug where array props would sometimes be undefined which created errors in some components. Fixed bug where layouts that relied on plugins would cause the dashboard to not be displayed properly if the plugin wasn't loaded yet. Fix bug where camera component stream prop was not being used.

## 1.4.0

### Minor Changes

- 2c1d42b: Added support for exporting a dashboard layout for the web

## 1.3.1

### Patch Changes

- eb126ff: Temporarily disabled changing themes in dashboard.

## 1.3.0

### Minor Changes

- 0c45ef1: Updated components for 2025 release. Updated NT4 client to use 4.1 (thanks AdvantageScope!). Dashboard only subscribes to networktable topics that are used by components while in live mode.

### Patch Changes

- Updated dependencies [0c45ef1]
  - @frc-web-components/react@3.0.0
  - @frc-web-components/fwc@3.2.0

## 1.2.0

### Minor Changes

- 9318bfc: git commit -m "Added missing components to dashboard. Updated field components for 2025 season. Improved appearance of swerve component. Fixed bug with the color property editor not having a valid color initially. Removed border around components. Added error boundary to components to prevent errors crashing the app."

### Patch Changes

- Updated dependencies [9318bfc]
  - @frc-web-components/fwc@3.1.0
  - @frc-web-components/react@2.0.0

## 1.1.0

### Minor Changes

- 92232ce: Add functions to add theme rules, set and get the current theme from the dashboard API

## 1.0.2

### Patch Changes

- Removed test svelte component. Updated example component in dashboard plugin templates and added missing images from dashboard interface.
- Updated dependencies
  - @frc-web-components/svelte@1.0.2

## 1.0.1

### Patch Changes

- Adding missing declaration files to packages
- Updated dependencies
  - @frc-web-components/react@1.0.1
  - @frc-web-components/fwc@3.0.1
  - @frc-web-components/svelte@1.0.1

## 1.0.0

### Major Changes

- Initial release for 2025 season. Created React version of FWC dashboard. Migrated other existing packages and converted to a pnpm monorepo. Upgraded to svelte 5.

### Patch Changes

- Updated dependencies
  - @frc-web-components/fwc@3.0.0
  - @frc-web-components/react@1.0.0
  - @frc-web-components/svelte@1.0.0
