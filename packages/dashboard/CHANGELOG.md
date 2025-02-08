# @frc-web-components/app

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
