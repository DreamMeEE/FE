import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelop = mode === "development";

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./global.scss";',
        },
      },
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: [
        { find: "@", replacement: "/src" },
        { find: "@assets", replacement: "/src/assets" },
      ],
    },
  };
});
