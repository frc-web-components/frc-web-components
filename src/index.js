import './dependencies';
import './source-providers';
import './frc-dashboard';
import './frc-dashboard-builder';
import './dashboard';
import './components';

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