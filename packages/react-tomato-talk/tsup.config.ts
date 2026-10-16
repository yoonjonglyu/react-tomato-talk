import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  external: ['react', 'react-dom'],
  onSuccess: async () => {
    // Ensure dist/style.css is available for easy direct import
    const srcCss = path.resolve(__dirname, 'src/styles/tomato.css');
    const distCss = path.resolve(__dirname, 'dist/style.css');
    fs.copyFileSync(srcCss, distCss);
  }
});
