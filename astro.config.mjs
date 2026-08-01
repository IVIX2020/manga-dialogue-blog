import { defineConfig } from 'astro/config';
import { remarkChatView } from './src/plugins/remark-chat-view.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ivix.github.io',
  base: process.env.NODE_ENV === 'production' ? '/manga-dialogue-blog' : '/',
  markdown: {
    remarkPlugins: [remarkChatView],
  },
});
