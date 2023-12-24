// https://dev.to/nicolaserny/create-a-react-component-library-with-vite-and-typescript-1ih9
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import fs from 'fs';
import path from "node:path";

function getEntries(): Record<string, string> {
  
  const componentEntries: Record<string, string> = {};
  
  const folderPath = path.resolve(__dirname, "src/components");
  const fileNames = fs.readdirSync(folderPath);

  fileNames.forEach((fileName) => {
    const componentName = fileName.split(".")[0];
    componentEntries[`components/${componentName}`] = `src/components/${fileName}`;
  });


  return {
    "fwc-react": "src/index.ts",
    "components/index": "src/components/index.ts",
    "networktables/index": "src/networktables/index.ts",
    ...componentEntries,
  };
}


export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: getEntries(),
      name: "FwcReact",
      // TODO: multiple entry points are not supported with umd
      // How do we add umd support then?
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
