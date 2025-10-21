// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   base: "/comm_buddy_v2.5/", 

// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ⚙️ Base path for subdirectory hosting (keep this)
  base: '/comm_buddy_v2.5/',

  // 🧩 Build options to ensure compatibility with Apache static hosting
  build: {
    outDir: 'dist', // or 'build' — whichever you deploy
    assetsDir: 'assets',
    sourcemap: false,
  },

  // ⚡ Server settings (for local dev only)
  server: {
    host: true,
    port: 5173,
    https: false, // local only, Namecheap will handle HTTPS
  },

  // ⚙️ Preview configuration (optional, helps with local HTTPS testing)
  preview: {
    https: true,
  },
});
