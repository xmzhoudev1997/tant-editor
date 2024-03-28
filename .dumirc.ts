import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'rc-tabs',
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/XM-MONACO-EDITOR-DEMO/dist/',
  hash: true,
  history: {type: 'hash',},
});
