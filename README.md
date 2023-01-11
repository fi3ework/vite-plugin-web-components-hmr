🫡 This repository is heavily forked from [@open-wc/dev-server-hmr](https://github.com/open-wc/open-wc/tree/c5444f79ac863d68abdbf84e5c49d9b07223bd1c/packages/dev-server-hmr) under [MIT](https://github.com/open-wc/open-wc/blob/c5444f79ac/LICENSE) licence, and adapting for the Vite plugin system.

---

## Installation

```bash
# pnpm
pnpm add vite-plugin-web-components-hmr -D
# yarn
yarn add vite-plugin-web-components-hmr -D
# npm
npm i vite-plugin-web-components-hmr -D
```

## Usage

The options for the plugin is exactly the same as [@open-wc/dev-server-hmr](https://www.npmjs.com/package/@open-wc/dev-server-hmr). Check the documentation [here](https://www.npmjs.com/package/@open-wc/dev-server-hmr).

```js
// example for using with Lit

import { defineConfig } from 'vite'
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr'

export default defineConfig({
  plugins: [
    hmrPlugin({
      include: ['./src/**/*.ts'],
      presets: [presets.lit],
    }),
  ],
})
```
