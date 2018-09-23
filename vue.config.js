const BrotliPlugin = require("brotli-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const webpack = require('webpack')


const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage*100, message, ...args);
};

let plugins = [];
if (process.env.NODE_ENV === "production") {
  const compressionTest = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
  plugins = [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // Must be greater than or equal to one
      minChunkSize:150
    }),
    new CompressionPlugin({
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      },
      compressionOptions: {
        numiterations: 15
      },
      minRatio: 0.99,
      test: compressionTest
    }),
    new BrotliPlugin({
      test: compressionTest,
      minRatio: 0.99
    }),
    new webpack.ProgressPlugin(handler)
  ];
}


module.exports = {
    baseUrl: process.env.BASE_URL,
    productionSourceMap: false,
    configureWebpack: {
      plugins
    },
    chainWebpack: config => {
      config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.compilerOptions.preserveWhitespace = true
          return options
        })
    },
}

