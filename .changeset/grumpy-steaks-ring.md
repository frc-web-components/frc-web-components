---
'@frc-web-components/app': patch
---

Fixed bug where array props would sometimes be undefined which created errors in some components. Fixed bug where layouts that relied on plugins would cause the dashboard to not be displayed properly if the plugin wasn't loaded yet. Fix bug where camera component stream prop was not being used.
