import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 专供 Cloudflare Pages 的标准 SPA 构建（不含妙搭托管产物整理插件）。
// 用法：vite build --config vite.config.cloudflare.ts
// 产物：dist-cloudflare/（index.html + assets + public 资源 + _redirects）
function cloudflareRedirectsPlugin(): Plugin {
  return {
    name: 'cloudflare-spa-redirects',
    apply: 'build',
    closeBundle() {
      const out = path.resolve(import.meta.dirname, 'dist-cloudflare');
      // Cloudflare Pages SPA 规则：所有未命中静态文件的路由都回退到 index.html，状态 200
      fs.writeFileSync(path.join(out, '_redirects'), '/*    /index.html   200\n');
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflareRedirectsPlugin()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist-cloudflare',
    emptyOutDir: true,
  },
});
