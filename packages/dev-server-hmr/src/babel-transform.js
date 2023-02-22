const { transformAsync } = require('@babel/core');

const babelPluginWcHmr = require('./babel/babelPluginWcHmr.js');
const { createError } = require('./utils.js');

/** @typedef {import('./babel/babelPluginWcHmr').BabelPluginWcHmrOptions} BabelPluginWcHmrOptions */

/**
 * @param {string} code
 * @param {string} filename
 * @param {BabelPluginWcHmrOptions} options
 * @return {Promise<import('@babel/core').BabelFileResult>}
 */
async function babelTransform(code, filename, options) {
  const largeFile = code.length > 100000;
  const result = await transformAsync(code, {
    caller: {
      name: '@open-wc/dev-server-hmr',
      supportsStaticESM: true,
    },
    plugins: [
      [babelPluginWcHmr, options],
      require.resolve('@babel/plugin-syntax-class-properties'),
      require.resolve('@babel/plugin-syntax-import-assertions'),
      require.resolve('@babel/plugin-syntax-top-level-await'),
    ],
    filename,
    babelrc: false,
    configFile: false,
    compact: largeFile,
    sourceType: 'module',
    sourceMaps: true
  });

  if (!result || !result.code) {
    throw createError(`Failed to babel transform ${filename}`);
  }
  return result;
}

module.exports = { babelTransform };
