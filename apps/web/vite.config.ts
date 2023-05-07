import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Workaround for prisma+vite import issues, see https://github.com/prisma/prisma/issues/12504
  resolve: {
    alias: {
      '.prisma/client/index-browser':
        '../../node_modules/.pnpm/@prisma+client@4.13.0_prisma@4.13.0/node_modules/.prisma/client/index-browser.js'
    }
  }
});
