// vite.config.ts
import react from "file:///C:/Users/Owner/Documents/repos/robotics/fwc/frc-web-components/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/Owner/Documents/repos/robotics/fwc/frc-web-components/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/Users/Owner/Documents/repos/robotics/fwc/frc-web-components/node_modules/vite-plugin-dts/dist/index.mjs";
import fs from "fs";
import path from "node:path";
var __vite_injected_original_dirname = "C:\\Users\\Owner\\Documents\\repos\\robotics\\fwc\\frc-web-components\\packages\\react";
function getEntries() {
  const componentEntries = {};
  const folderPath = path.resolve(__vite_injected_original_dirname, "src/components");
  const fileNames = fs.readdirSync(folderPath);
  fileNames.forEach((fileName) => {
    const componentName = fileName.split(".")[0];
    componentEntries[`components/${componentName}`] = `src/components/${fileName}`;
  });
  return {
    "fwc-react": "src/index.ts",
    "components/index": "src/components/index.ts",
    "networktables/index": "src/networktables/index.ts",
    ...componentEntries
  };
}
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: getEntries(),
      name: "FwcReact",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "@frc-web-components/fwc"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPd25lclxcXFxEb2N1bWVudHNcXFxccmVwb3NcXFxccm9ib3RpY3NcXFxcZndjXFxcXGZyYy13ZWItY29tcG9uZW50c1xcXFxwYWNrYWdlc1xcXFxyZWFjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcT3duZXJcXFxcRG9jdW1lbnRzXFxcXHJlcG9zXFxcXHJvYm90aWNzXFxcXGZ3Y1xcXFxmcmMtd2ViLWNvbXBvbmVudHNcXFxccGFja2FnZXNcXFxccmVhY3RcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL093bmVyL0RvY3VtZW50cy9yZXBvcy9yb2JvdGljcy9md2MvZnJjLXdlYi1jb21wb25lbnRzL3BhY2thZ2VzL3JlYWN0L3ZpdGUuY29uZmlnLnRzXCI7Ly8gaHR0cHM6Ly9kZXYudG8vbmljb2xhc2VybnkvY3JlYXRlLWEtcmVhY3QtY29tcG9uZW50LWxpYnJhcnktd2l0aC12aXRlLWFuZC10eXBlc2NyaXB0LTFpaDlcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XHJcblxyXG5mdW5jdGlvbiBnZXRFbnRyaWVzKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xyXG4gIGNvbnN0IGNvbXBvbmVudEVudHJpZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuXHJcbiAgY29uc3QgZm9sZGVyUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2NvbXBvbmVudHNcIik7XHJcbiAgY29uc3QgZmlsZU5hbWVzID0gZnMucmVhZGRpclN5bmMoZm9sZGVyUGF0aCk7XHJcblxyXG4gIGZpbGVOYW1lcy5mb3JFYWNoKChmaWxlTmFtZSkgPT4ge1xyXG4gICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGZpbGVOYW1lLnNwbGl0KFwiLlwiKVswXTtcclxuICAgIGNvbXBvbmVudEVudHJpZXNbXHJcbiAgICAgIGBjb21wb25lbnRzLyR7Y29tcG9uZW50TmFtZX1gXHJcbiAgICBdID0gYHNyYy9jb21wb25lbnRzLyR7ZmlsZU5hbWV9YDtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIFwiZndjLXJlYWN0XCI6IFwic3JjL2luZGV4LnRzXCIsXHJcbiAgICBcImNvbXBvbmVudHMvaW5kZXhcIjogXCJzcmMvY29tcG9uZW50cy9pbmRleC50c1wiLFxyXG4gICAgXCJuZXR3b3JrdGFibGVzL2luZGV4XCI6IFwic3JjL25ldHdvcmt0YWJsZXMvaW5kZXgudHNcIixcclxuICAgIC4uLmNvbXBvbmVudEVudHJpZXMsXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgZHRzKHtcclxuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogZ2V0RW50cmllcygpLFxyXG4gICAgICBuYW1lOiBcIkZ3Y1JlYWN0XCIsXHJcbiAgICAgIC8vIFRPRE86IG11bHRpcGxlIGVudHJ5IHBvaW50cyBhcmUgbm90IHN1cHBvcnRlZCB3aXRoIHVtZFxyXG4gICAgICAvLyBIb3cgZG8gd2UgYWRkIHVtZCBzdXBwb3J0IHRoZW4/XHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxyXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCwgZW50cnlOYW1lKSA9PiBgJHtlbnRyeU5hbWV9LiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJAZnJjLXdlYi1jb21wb25lbnRzL2Z3Y1wiXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgcmVhY3Q6IFwiUmVhY3RcIixcclxuICAgICAgICAgIFwicmVhY3QtZG9tXCI6IFwiUmVhY3RET01cIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBTGpCLElBQU0sbUNBQW1DO0FBT3pDLFNBQVMsYUFBcUM7QUFDNUMsUUFBTSxtQkFBMkMsQ0FBQztBQUVsRCxRQUFNLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUMzRCxRQUFNLFlBQVksR0FBRyxZQUFZLFVBQVU7QUFFM0MsWUFBVSxRQUFRLENBQUMsYUFBYTtBQUM5QixVQUFNLGdCQUFnQixTQUFTLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDM0MscUJBQ0UsY0FBYyxhQUFhLEVBQzdCLElBQUksa0JBQWtCLFFBQVE7QUFBQSxFQUNoQyxDQUFDO0FBRUQsU0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2Isb0JBQW9CO0FBQUEsSUFDcEIsdUJBQXVCO0FBQUEsSUFDdkIsR0FBRztBQUFBLEVBQ0w7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFdBQVc7QUFBQSxNQUNsQixNQUFNO0FBQUE7QUFBQTtBQUFBLE1BR04sU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLFVBQVUsQ0FBQyxRQUFRLGNBQWMsR0FBRyxTQUFTLElBQUksTUFBTTtBQUFBLElBQ3pEO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLHlCQUF5QjtBQUFBLE1BQzFELFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
