const merge = require('deepmerge');
const { createDefaultConfig } = require('@open-wc/testing-karma');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        {
          pattern: 'nk-line-chart.spec.js',
          type: 'module'
        }
      ],

      esm: {
        nodeResolve: true
      }
    })
  );
  return config;
};
