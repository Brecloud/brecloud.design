import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 专供 Vercel 的标准 SPA 构建（不含妙搭托管产物整理插件）。
// 用法：vite build --config vite.config.vercel.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist-vercel',
    emptyOutDir: true,
  },
});
