import Nt4Provider from './nt4/nt4-provider';
import Nt3Provider from './nt3/nt3-provider';
import FrcDashboard from '../dashboard/frc-dashboard';

const ntProviderMap = new Map<
  FrcDashboard,
  { nt3?: Nt3Provider; nt4?: Nt4Provider }
>();

export function isUsingNt3(): boolean {
  const value = localStorage.getItem('usingNt3');
  if (!value) {
    return false;
  }
  try {
    const usingNt3 = JSON.parse(value);
    return !!usingNt3;
  } catch (e) {
    console.error(
      'Error getting NT version from localStorage. Defaulting to NT4:',
      e
    );
    return false;
  }
}

export function setIsUsingNt3(usingNt3: boolean): void {
  localStorage.setItem('usingNt3', usingNt3.toString());
}

export function setNetworkTablesProvider(dashboard: FrcDashboard): void {
  dashboard.getStore().removeSourceProvider('NetworkTables');
  if (!ntProviderMap.has(dashboard)) {
    ntProviderMap.set(dashboard, {});
  }
  const providers = ntProviderMap.get(dashboard)!;
  if (isUsingNt3()) {
    if (!providers.nt3) {
      providers.nt3 = new Nt3Provider();
    }
    dashboard.addSourceProvider('NetworkTables', providers.nt3);
  } else {
    if (!providers.nt4) {
      providers.nt4 = new Nt4Provider();
    }
    dashboard.addSourceProvider('NetworkTables', providers.nt4);
  }
}
