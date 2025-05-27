import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import { defineConfig, mergeConfig } from 'vite';
import type { PluginOption } from 'vite';

const baseConfig = defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }) as unknown as PluginOption,
    viteReact(),
    tailwindcss() as unknown as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

export default mergeConfig(
  baseConfig,
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }),
);
