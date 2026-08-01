import { defineConfig } from 'astro/config';
import { remarkChatView } from './src/plugins/remark-chat-view.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ivix2020.github.io',
  base: '/manga-dialogue-blog',
  markdown: {
    remarkPlugins: [remarkChatView],
  },
});
