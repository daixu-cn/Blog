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

export default defineConfig({
  plugins: [
    vue(),
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
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: "static/js/[hash].js",
        entryFileNames: "static/js/[hash].js",
        assetFileNames: "static/[ext]/[hash].[ext]",
        manualChunks(id) {
          // 静态资源分拆打包
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString()
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
    port: 8080
  }
})
