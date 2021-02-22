import './dependencies';
import './source-providers';
import './frc-dashboard';
import './frc-dashboard-builder';
import './dashboard';

import { getExtensions } from './db';

window.dashboard = {
  addComponent: window.webbitRegistry.define,
  LitElement: window.webbit.LitElement,
  Component: window.webbit.Webbit,
  css: window.webbit.css,
  html: window.webbit.html,
  svg: window.webbit.svg,
  SourceProvider: window.webbitStore.SourceProvider,
  addSourceProvider: window.webbitStore.addSourceProvider,
  addSourceProviderType: window.webbitStore.addSourceProviderType,
};

async function initExtensions() {
  const extensions = await getExtensions();
  extensions.forEach(({ name, version, code }) => {
    let extensionFn;
    try { 
      extensionFn = new Function(code);
    } catch(e) {
      console.error(`Error compiling extension ${name} version ${version}`);
    }

    if (extensionFn) {
      try { 
        extensionFn();
      } catch(e) {
        console.error(e);
      }
    }
  });
}

async function init() {
  try {
    await initExtensions();
  } catch (e) {
    console.error
  }

  require('./components');
}

init();
