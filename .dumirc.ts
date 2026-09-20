import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: '',
  themeConfig: {
    name: 'tant-editor',
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/tant-editor/dist/',
  hash: true,
  history: {type: 'hash',},
  styles: ['https://td-fe.github.io/figma-tokens/variables.css'],
  chainWebpack: (memo) => {
    memo.experiments({
      asyncWebAssembly: true,
    });
    return memo;
  },
  mfsu: false,
});
