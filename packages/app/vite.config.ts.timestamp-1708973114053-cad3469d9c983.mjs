// vite.config.ts
import { defineConfig } from "file:///C:/Users/Owner/Documents/repos/robotics/fwc/frc-web-components/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/Users/Owner/Documents/repos/robotics/fwc/frc-web-components/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: {
        "fwc-app": "src/index.ts"
      },
      name: "FwcApp",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    rollupOptions: {
      external: ["lit", "@frc-web-components/fwc"]
    }
  },
  plugins: [dts()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPd25lclxcXFxEb2N1bWVudHNcXFxccmVwb3NcXFxccm9ib3RpY3NcXFxcZndjXFxcXGZyYy13ZWItY29tcG9uZW50c1xcXFxwYWNrYWdlc1xcXFxhcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE93bmVyXFxcXERvY3VtZW50c1xcXFxyZXBvc1xcXFxyb2JvdGljc1xcXFxmd2NcXFxcZnJjLXdlYi1jb21wb25lbnRzXFxcXHBhY2thZ2VzXFxcXGFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvT3duZXIvRG9jdW1lbnRzL3JlcG9zL3JvYm90aWNzL2Z3Yy9mcmMtd2ViLWNvbXBvbmVudHMvcGFja2FnZXMvYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBidWlsZDoge1xyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiB7XHJcbiAgICAgICAgXCJmd2MtYXBwXCI6IFwic3JjL2luZGV4LnRzXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hbWU6IFwiRndjQXBwXCIsXHJcbiAgICAgIC8vIFRPRE86IG11bHRpcGxlIGVudHJ5IHBvaW50cyBhcmUgbm90IHN1cHBvcnRlZCB3aXRoIHVtZFxyXG4gICAgICAvLyBIb3cgZG8gd2UgYWRkIHVtZCBzdXBwb3J0IHRoZW4/XHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxyXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCwgZW50cnlOYW1lKSA9PiBgJHtlbnRyeU5hbWV9LiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1wibGl0XCIsICdAZnJjLXdlYi1jb21wb25lbnRzL2Z3YyddLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtkdHMoKV0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVhLFNBQVMsb0JBQW9CO0FBQ3BjLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsUUFDTCxXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsTUFBTTtBQUFBO0FBQUE7QUFBQSxNQUdOLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVLENBQUMsUUFBUSxjQUFjLEdBQUcsU0FBUyxJQUFJLE1BQU07QUFBQSxJQUN6RDtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE9BQU8seUJBQXlCO0FBQUEsSUFDN0M7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsSUFBSSxDQUFDO0FBQ2pCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
