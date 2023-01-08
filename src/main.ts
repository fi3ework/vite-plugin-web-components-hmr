import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { lit } from './presets/lit.js'
const { babelTransform } = require('./babel/babelTransform.js')

const litPreset = {
  decorators: lit.decorators,
  baseClasses: lit.baseClasses,
  functions: [],
  patches: [lit.patch],
}
const wcHmrRuntime = fs.readFileSync(
  path.resolve(__dirname, 'wcHmrRuntime.js'),
  'utf-8'
)

export const createPlugin: () => Plugin = () => {
  let shouldSkip = false

  return {
    name: 'lit-hrm',
    configResolved(config) {
      shouldSkip = config.command === 'build' || config.isProduction
    },
    // handleHotUpdate(ctx) {
    //   console.log('👩‍🎤', ctx)
    //   ctx.server.ws.send({
    //     type: 'custom',
    //     event: 'special-update',
    //     data: {}
    //   })
    //   return []
    // },
    resolveId(id) {
      if (id.startsWith('/__web-dev-server__')) {
        return id
      }
    },
    load(id) {
      if (id === '/__web-dev-server__/wc-hmr/runtime.js') {
        return wcHmrRuntime
      }

      if (id === '/__web-dev-server__/wc-hmr/patch.js') {
        return litPreset.patches.join('\n')
      }
    },
    async transform(code, id, options) {
      if (id.endsWith('.js') || id.startsWith('/__web-dev-server__')) {
        return
      }

      if (!id.includes('my-element')) {
        return
      }

      const parsedPluginConfig = litPreset

      let result = ''
      if (id.includes('my-element')) {
        result = await babelTransform(code, '???', {
          baseClasses: parsedPluginConfig.baseClasses,
          decorators: parsedPluginConfig.decorators,
          functions: parsedPluginConfig.functions,
          patches: parsedPluginConfig.patches,
          rootDir: '?',
        })
      }

      return result
    },
    transformIndexHtml() {},
  }
}
