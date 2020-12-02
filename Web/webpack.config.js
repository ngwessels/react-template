const path = require('path');
const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DuplicatesPlugin } = require("inspectpack/plugin");

//Website Status
const { applicationStatus } = require('../server/applicationStatus');
let mode = 'development', optimization = {}, devtool
if (applicationStatus !== 'Test') {
  mode = 'production';
  optimization = {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: "manifest",
    },
  }
}
if (applicationStatus === 'Test') {
  devtool = '#source-map';
}

module.exports = {
  mode,
  optimization,
  entry: [
    'react-hot-loader/patch',
    'react',
    'react-dom',
    'webpack/hot/only-dev-server',
    resolve(__dirname, "src", "index.jsx")
  ],

  output: {
    filename: 'app.bundle.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx', '*']
  },

  devtool,

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'dist'),
    publicPath: '/',
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src')
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
          {
            loader: 'img-loader',
          }
        ]
      },
      {
        test: /\.jsx?$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
          emitWarning: true,
          configFile: "./.eslintrc.json"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin([
      { from: './src/assets/photoEditor', to: './src/assets/photoEditor' },
      { from: './src/assets/imgs/favicon.ico', to: './src/assets/imgs/favicon.ico' }
    ]),
    new DuplicatesPlugin({
      emitErrors: false,
      emitHandler: undefined,
      ignoredPackages: undefined,
      verbose: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({}),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'template.ejs',
      appMountId: 'react-app-root',
      title: 'react-template',
      filename: resolve(__dirname, "build", "index.html"),
    }),
  ]
}
