const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Phaser webpack config
const phaser = path.join(__dirname, '/node_modules/phaser/')
const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['phaser', 'webfontloader']
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  watch: true,
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    definePlugin,
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      hash: false
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './build']
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './assets/**/*', to: './'
        }
      ]
    })
  ],
  devtool: prod ? false : 'source-map',
  devServer: {
    port: 3000
  },
  module: {
    rules: [
      {
        test: /phaser-split\.js$/,
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'Phaser',
            override: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  resolve: {
    alias: {
      phaser: phaser
    },
    fallback: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  }
}
