import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'rc-tabs',
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/rc-tabs/docs-dist/',
  hash: true,
  history: {type: 'hash',},
});
