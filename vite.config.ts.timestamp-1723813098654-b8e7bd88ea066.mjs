// vite.config.ts
import { defineConfig } from "file:///C:/Users/14852/Desktop/code/pc-run/pc-run-view/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/14852/Desktop/code/pc-run/pc-run-view/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///C:/Users/14852/Desktop/code/pc-run/pc-run-view/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/14852/Desktop/code/pc-run/pc-run-view/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///C:/Users/14852/Desktop/code/pc-run/pc-run-view/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var vite_config_default = defineConfig({
  build: {
    outDir: "../dist/view"
  },
  experimental: {
    renderBuiltUrl(filename, { hostId, hostType, type }) {
      console.log(hostId, hostType, type, "???---", filename);
      if (hostType === "css")
        return `../${filename}`;
      return `./${filename}`;
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: "./src/auto-imports.d.ts"
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "./src/components.d.ts"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNDg1MlxcXFxEZXNrdG9wXFxcXGNvZGVcXFxccGMtcnVuXFxcXHBjLXJ1bi12aWV3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNDg1MlxcXFxEZXNrdG9wXFxcXGNvZGVcXFxccGMtcnVuXFxcXHBjLXJ1bi12aWV3XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8xNDg1Mi9EZXNrdG9wL2NvZGUvcGMtcnVuL3BjLXJ1bi12aWV3L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICcuLi9kaXN0L3ZpZXcnLFxyXG4gIH0sXHJcbiAgZXhwZXJpbWVudGFsOiB7XHJcbiAgICByZW5kZXJCdWlsdFVybChmaWxlbmFtZTogc3RyaW5nLCB7IGhvc3RJZCwgaG9zdFR5cGUsIHR5cGUgfTogeyBob3N0SWQ6IHN0cmluZywgaG9zdFR5cGU6ICdqcycgfCAnY3NzJyB8ICdodG1sJywgdHlwZTogJ3B1YmxpYycgfCAnYXNzZXQnIH0pIHtcclxuICAgICAgY29uc29sZS5sb2coaG9zdElkLCBob3N0VHlwZSwgdHlwZSwgJz8/Py0tLScsIGZpbGVuYW1lKVxyXG4gICAgICBpZihob3N0VHlwZSA9PT0gJ2NzcycpIHJldHVybiBgLi4vJHtmaWxlbmFtZX1gXHJcbiAgICAgIHJldHVybiBgLi8ke2ZpbGVuYW1lfWA7XHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxyXG4gICAgICBkdHM6ICcuL3NyYy9hdXRvLWltcG9ydHMuZC50cycsIFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcclxuICAgICAgZHRzOiAnLi9zcmMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFUsU0FBUyxvQkFBb0I7QUFDdlcsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBR3BDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixlQUFlLFVBQWtCLEVBQUUsUUFBUSxVQUFVLEtBQUssR0FBa0Y7QUFDMUksY0FBUSxJQUFJLFFBQVEsVUFBVSxNQUFNLFVBQVUsUUFBUTtBQUN0RCxVQUFHLGFBQWE7QUFBTyxlQUFPLE1BQU0sUUFBUTtBQUM1QyxhQUFPLEtBQUssUUFBUTtBQUFBLElBQ3RCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDakMsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDakMsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
