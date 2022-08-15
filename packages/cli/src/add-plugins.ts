async function loadPlugins(pluginPath: string, dashboard: any) {
  try {
    const exports = await import(pluginPath);
    exports?.default?.(dashboard);
    // const { elements } = exports?.default ?? {};
    // if (elements) {
    //   window.FwcDashboard.addElements(elements);
    // }
  } catch (error) {
    console.error(`Error loading plugins "${pluginPath}"`, error);
  }
}

if (process.env.PLUGIN_PATH) {
  loadPlugins(process.env.PLUGIN_PATH, (window as any).dashboard);
}
