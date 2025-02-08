import packageJson from './package.json';
import { getConfig } from '../../vite.config';

export default getConfig({ packageJson, isDev: true });
