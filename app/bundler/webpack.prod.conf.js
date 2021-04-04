'use strict'

const path = require('path')
const utils = require('./utils');
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

var root_path = path.resolve(__dirname, '../../dist');

var webpack_config = {
  watch: true,
  output: {
    path: root_path,
    publicPath: './',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true, map: { inline: false } }
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../src/static'),
      to: path.resolve(root_path, './static')
    }]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        return (
          module.resource &&
          /\.(js|css|sass|scss|less|json)$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}

/*
webpack_config.plugins.push(
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false
      }
    },
    sourceMap: true,
    parallel: true
  }
));
*/
// webpack_config.plugins.push(
//   new BundleAnalyzerPlugin({
//     analyzerMode: 'static',
//     generateStatsFile: false,
//     reportFilename:'report.html',
//     statsOptions: { source: true },
//     openAnalyzer:false
//   })
// );

webpack_config["devtool"] = 'eval-cheap-source-map';


var webpackConfig = merge(baseWebpackConfig, webpack_config)


module.exports = merge(webpackConfig, { module: { rules: utils.styleLoaders({ sourceMap: true, usePostCSS: true }) } });
