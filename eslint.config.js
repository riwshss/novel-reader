// 只用來檢查前端程式有沒有用到 iOS 10 Safari 沒有的 API（目標見 package.json 的 browserslist）。
// 語法（?.、??、async 等）由 esbuild 降級，這裡只管執行期 API。
import compat from 'eslint-plugin-compat';

export default [
  {
    files: ['js/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { window: 'readonly', document: 'readonly' } },
    plugins: { compat },
    settings: { lintAllEsApis: true },
    rules: { 'compat/compat': 'error' },
  },
];
