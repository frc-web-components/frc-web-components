import { addSourceProviderType } from '@lit-dashboard/lit-dashboard/app';
import NetworkTables from './networktables';
import NetworkTablesProvider from './provider.js';


addSourceProviderType(NetworkTablesProvider);
window.NetworkTables = NetworkTables;

