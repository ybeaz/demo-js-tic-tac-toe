// 'use strict';

/*  NodeJS server with express.js
  cd c:/Data/Dev/UserTo/r1.userto.com/
  node server.js
  localhost:3000/demo-js-redux-example.html
*/

const webpack = require('webpack')
const glob = require('glob')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TSLintPlugin = require('tslint-webpack-plugin')

// var MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const styledComponentsTransformer = require('typescript-plugin-styled-components').default;
const keysTransformer = require('ts-transformer-keys/transformer').default;

// tttReact: ['./src/index.tsx'], // ['babel-polyfill', './index.js', './index.tsx']

module.exports = {
  entry: {
    tttJs: ['./src/index.ts'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/dist'),
    filename: '[name].min.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.es6', 'less', 'css', 'config', 'variables', 'overrides'],
  },
  module: {
    rules: [
      {
        test: /\.(ts[\S]{0,2})$/i,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'awesome-typescript-loader', // 'tslint-loader',
            options: {
              configFile: 'tslint.json',
              getCustomTransformers: program => ({
                before: [
                  styledComponentsTransformer(),
                  keysTransformer(program),
                ],
              }),
            },
          },
        ],
      },
      {
        test: /\.(ts[\S]{0,2})$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader', // 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
              getCustomTransformers: program => ({
                before: [
                  styledComponentsTransformer(),
                  keysTransformer(program),
                ],
              }),
            },
          },
        ],
      },
      {
        test: /\.(js[\S]{0,2})$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              plugins: ['@babel/proposal-class-properties'],
            },
          },
        ],
      },
      {
        test: /\.(css|less)$/i,
        exclude: [/node_modules/],
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        },
        {
          loader: 'css-loader', // translates CSS into CommonJS
        },
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            javascriptEnabled: true,
          },
        }],
      },
      // this rule handles images
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /node_modules/,
        use: [
          'url-loader?limit=10000',
          'img-loader',
          'file-loader?name=[name].[ext]?[hash]',
        ],
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      // the following 3 rules handle font extraction
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.otf(\?.*)?$/,
        use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react', 'react-dom': 'ReactDOM',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsOptions: { source: false },
    }),
    new HtmlWebpackPlugin({
      title: 'Production',
      template: 'template.html',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new TSLintPlugin({
      files: ['./src/**/*.ts', './src/**/*.tsx'],
      config: './tslint.json',
      warningsAsError: true,
      silent: true,
    }),
  ],
  performance: {
    hints: false,
  },
  watch: false,
  target: 'web',
  externals: [
    { pg: true },
  ],
  node: {
    fs: 'empty',
  },
  optimization: {
    namedModules: false,
    namedChunks: false,
    flagIncludedChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    noEmitOnErrors: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
  },
}
