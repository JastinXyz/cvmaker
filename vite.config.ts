import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import createImportPlugin from 'vite-plugin-import';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), createImportPlugin([
    {
      libraryName: '@mui/icons-material',
      'style': true,   // or 'css'
    }
  ])],
});
