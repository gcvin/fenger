const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isprod = process.env.NODE_ENV === 'production'
const clean = new CleanWebpackPlugin(['./dist', './index.html'])

const config = {
  output: {
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }, 
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8129,
            name: '[name].[hash:8].[ext]'
          }
        }
      }
    ]
  },
  stats: {
    modules: false,
    children: false,
    entrypoints: false
  },
  devServer: {
    stats: 'minimal',
    inline: true,
    hot: true
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "../index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].[hash:8].css"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

isprod && config.plugins.unshift(clean)

module.exports = config
