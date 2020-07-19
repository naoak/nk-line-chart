const path = require('path');
const { merge } = require('webpack-merge');
const { createDefaultConfig } = require('@open-wc/building-webpack');

const config = createDefaultConfig({
  input: path.resolve(__dirname, './demo/index.html')
});

module.exports = merge(config, {
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  }
});
