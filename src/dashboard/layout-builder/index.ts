import FrcDashboard from '../frc-dashboard';

export default function layoutBuilder(dashboard: FrcDashboard): void {
  const store = dashboard.getStore();
  store.subscribe(
    'NetworkTables',
    '/Shuffleboard',
    (value) => {
      // const value = dashboard.getStore().getSourceValue('NetworkTables', '/Shuffleboard');
      console.log('shuffleboard:', JSON.stringify(value, null, 2));
    },
    true
  );
}
