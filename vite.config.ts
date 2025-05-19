import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Configuração corrigida do HMR
      overlay: true,
    },
  },
  plugins: [
    react(),
    mode === 'development' && (() => {
      // Plugin vazio para evitar erros com o lovable-tagger
      return {
        name: 'development-only-plugin',
      }
    })()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom', '@radix-ui/react-dropdown-menu'], 
  },
  optimizeDeps: {
    include: ['@radix-ui/react-dropdown-menu'],
  },
  build: {
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      }
    }
  }
}));
