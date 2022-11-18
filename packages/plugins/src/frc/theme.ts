import { FrcDashboard } from '@frc-web-components/dashboard';

export default function addTheme(dashboard: FrcDashboard): void {
  dashboard.addThemeRules('dark', {
    /* Base (background) */
    '--lumo-base-color': 'hsl(214, 35%, 21%)',

    /* Tint */
    '--lumo-tint-5pct': 'hsla(214, 65%, 85%, 0.06)',
    '--lumo-tint-10pct': 'hsla(214, 60%, 80%, 0.14)',
    '--lumo-tint-20pct': 'hsla(214, 64%, 82%, 0.23)',
    '--lumo-tint-30pct': 'hsla(214, 69%, 84%, 0.32)',
    '--lumo-tint-40pct': 'hsla(214, 73%, 86%, 0.41)',
    '--lumo-tint-50pct': 'hsla(214, 78%, 88%, 0.5)',
    '--lumo-tint-60pct': 'hsla(214, 82%, 90%, 0.58)',
    '--lumo-tint-70pct': 'hsla(214, 87%, 92%, 0.69)',
    '--lumo-tint-80pct': 'hsla(214, 91%, 94%, 0.8)',
    '--lumo-tint-90pct': 'hsla(214, 96%, 96%, 0.9)',
    '--lumo-tint': 'hsl(214, 100%, 98%)',

    /* Shade */
    '--lumo-shade-5pct': 'hsla(214, 0%, 0%, 0.07)',
    '--lumo-shade-10pct': 'hsla(214, 4%, 2%, 0.15)',
    '--lumo-shade-20pct': 'hsla(214, 8%, 4%, 0.23)',
    '--lumo-shade-30pct': 'hsla(214, 12%, 6%, 0.32)',
    '--lumo-shade-40pct': 'hsla(214, 16%, 8%, 0.41)',
    '--lumo-shade-50pct': 'hsla(214, 20%, 10%, 0.5)',
    '--lumo-shade-60pct': 'hsla(214, 24%, 12%, 0.6)',
    '--lumo-shade-70pct': 'hsla(214, 28%, 13%, 0.7)',
    '--lumo-shade-80pct': 'hsla(214, 32%, 13%, 0.8)',
    '--lumo-shade-90pct': 'hsla(214, 33%, 13%, 0.9)',
    '--lumo-shade': 'hsl(214, 33%, 13%)',

    /* Contrast */
    '--lumo-contrast-5pct': 'var(--lumo-tint-5pct)',
    '--lumo-contrast-10pct': 'var(--lumo-tint-10pct)',
    '--lumo-contrast-20pct': 'var(--lumo-tint-20pct)',
    '--lumo-contrast-30pct': 'var(--lumo-tint-30pct)',
    '--lumo-contrast-40pct': 'var(--lumo-tint-40pct)',
    '--lumo-contrast-50pct': 'var(--lumo-tint-50pct)',
    '--lumo-contrast-60pct': 'var(--lumo-tint-60pct)',
    '--lumo-contrast-70pct': 'var(--lumo-tint-70pct)',
    '--lumo-contrast-80pct': 'var(--lumo-tint-80pct)',
    '--lumo-contrast-90pct': 'var(--lumo-tint-90pct)',
    '--lumo-contrast': 'var(--lumo-tint)',

    /* Text */
    '--lumo-header-text-color': 'var(--lumo-contrast)',
    '--lumo-body-text-color': 'var(--lumo-contrast-90pct)',
    '--lumo-secondary-text-color': 'var(--lumo-contrast-70pct)',
    '--lumo-tertiary-text-color': 'var(--lumo-contrast-50pct)',
    '--lumo-disabled-text-color': 'var(--lumo-contrast-30pct)',

    /* Primary */
    '--lumo-primary-color': 'hsl(214, 90%, 48%)',
    '--lumo-primary-color-50pct': 'hsla(214, 90%, 70%, 0.69)',
    '--lumo-primary-color-10pct': 'hsla(214, 90%, 55%, 0.13)',
    '--lumo-primary-text-color': 'hsl(214, 90%, 77%)',
    '--lumo-primary-contrast-color': '#fff',

    /* Error */
    '--lumo-error-color': 'hsl(3, 79%, 49%)',
    '--lumo-error-color-50pct': 'hsla(3, 75%, 62%, 0.5)',
    '--lumo-error-color-10pct': 'hsla(3, 75%, 62%, 0.14)',
    '--lumo-error-text-color': 'hsl(3, 100%, 80%)',

    /* Success */
    '--lumo-success-color': 'hsl(145, 72%, 30%)',
    '--lumo-success-color-50pct': 'hsla(145, 92%, 51%, 0.5)',
    '--lumo-success-color-10pct': 'hsla(145, 92%, 51%, 0.1)',
    '--lumo-success-text-color': 'hsl(145, 85%, 46%)',

    /* Dashboard */
    '--dashboard-background': 'hsl(214, 35%, 21%)',
    '--dashboard-navbar-background': '#222',

    /* frc-bar */
    '--frc-bar-background': '#444',
    '--frc-bar-foreground': 'steelblue',
    '--frc-bar-color': '#fff',

    /* frc-table-axis */
    '--frc-tab-axis-text-color': '#fff',

    /* frc-3-axis-accelerometer */
    '--frc-3-axis-accelerometer-label-color': '#fff',

    /* --frc-basic-fms-info */
    '--frc-basic-fms-info-text-color': '#fff',

    /* frc-differential-drivebase */
    '--frc-differential-drivebase-drivetrain-color': '#aaa',

    /* frc-mecanum-drivebase */
    '--frc-mecanum-drivebase-drivetrain-color': '#aaa',

    /* frc-encoder */
    '--frc-encoder-label-color': '#fff',

    /* frc-gyro */
    '--frc-gyro-big-tick-color': '#fff',
    '--frc-gyro-tick-color': '#777',
    '--frc-gyro-edge-color': '#fff',
    '--frc-gyro-dial-circle-color': '#444',
    '--frc-gyro-dial-circle-stroke-color': '#ccc',
    '--frc-gyro-text-color': '#fff',

    /* frc-if, frc-label, frc-number-label */
    '--frc-label-text-color': '#fff',

    /* frc-voltage-view */
    '--frc-voltage-view-foreground-color': '#dd9b0d',

    /* frc-robot-subsystem */
    '--frc-robot-subsystem-header-color': '#A020F0',

    /* frc-toggle-switch */
    '--frc-toggle-switch-color': '#999',

    /* Line Chart */
    '--frc-line-chart-text-color': 'white',

    /* frc-gauge */
    '--frc-gauge-fill-color': 'rgb(90,150,200)',
    '--frc-gauge-color': '#666',
    '--frc-gauge-text-color': 'rgb(220, 220, 220)',
  });
}
