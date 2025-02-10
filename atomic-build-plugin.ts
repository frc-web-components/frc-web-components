import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs-extra';

export function atomicBuildPlugin(): Plugin {
  let tempOutDir: string;
  let finalOutDir: string;

  return {
    name: 'vite-plugin-atomic-build',
    apply: 'build',
    configResolved(resolvedConfig) {
      // Store the final output directory
      finalOutDir = resolvedConfig.build.outDir || 'dist';
      // Set the temporary directory
      tempOutDir = `${finalOutDir}-temp`;
      // Update the build configuration to use the temporary directory
      resolvedConfig.build.outDir = tempOutDir;
    },
    closeBundle: {
      order: 'post',
      handler: async () => {
        // After the build is complete, replace the dist directory atomically
        const tempDir = path.resolve(process.cwd(), tempOutDir);
        const finalDir = path.resolve(process.cwd(), finalOutDir);
        // const backupDir = `${finalDir}_backup`;

        if (!(await fs.pathExists(tempDir))) {
          return;
        }

        try {
          // Ensure finalDir exists
          await fs.ensureDir(finalDir);

          // Remove contents of finalDir
          await fs.emptyDir(finalDir);

          // Copy contents of tempDir to finalDir
          await fs.copy(tempDir, finalDir);

          // Remove tempDir
          await fs.remove(tempDir);
        } catch (error) {
          console.error('Error during atomic build:', error);
          // Clean up temp directory if something went wrong

          if (await fs.pathExists(tempDir)) {
            await fs.remove(tempDir);
          }

          process.exit(1);
        }
      },
    },
  };
}
