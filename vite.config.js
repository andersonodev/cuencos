import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Substitui a chamada não definida por um plugin vazio similar ao vite.config.ts
    mode === 'development' && (() => {
      // Plugin vazio para evitar erros com o lovable-tagger
      return {
        name: 'development-only-plugin',
      }
    })()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
