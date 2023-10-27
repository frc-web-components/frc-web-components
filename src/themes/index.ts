import { FrcDashboard } from '../dashboard';
import addTheme from './dark-theme';

export { default as DashboardThemes } from './dashboard-themes';
export { darkTheme } from './dark-theme';

export default function addThemes(dashboard: FrcDashboard): void {
  addTheme(dashboard);
}
