const merge = require('webpack-merge');
const createDefaultConfig = require('@open-wc/testing-karma/legacy-config.js');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        {
          pattern: 'nk-line-chart.spec.js',
          // type: 'module',
        }
      ]
    })
  );
  return config;
};
