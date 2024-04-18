import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import progress from "vite-plugin-progress"
import viteCompression from "vite-plugin-compression"
import setupExtend from "vite-plugin-vue-setup-extend"

export default defineConfig({
  plugins: [
    vue(),
    setupExtend(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon"
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ["ep"]
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
    progress(),
    viteCompression({ threshold: 10240 })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  esbuild: {
    drop:
      process.env.NODE_ENV === "production"
        ? ["console", "debugger"]
        : undefined
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "js/[hash].js",
        entryFileNames: "js/[hash].js",
        assetFileNames: "assets/[ext]/[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"
          }
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/style/scss/_variables.scss";
          @import "@/assets/style/scss/_mixins.scss";
        `
      }
    }
  },
  server: {
    open: true,
    host: "0.0.0.0",
    port: 7792
  }
})
