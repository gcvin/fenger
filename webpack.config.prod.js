const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
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
        test: /\.(png|jpg|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8129,
            name: '[name].[hash:8].[ext]',
            publicPath: './dist'
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
  plugins: [
    new CleanWebpackPlugin(['./dist', './index.html']),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "../index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].[hash:8].css"
    })
  ]
}
