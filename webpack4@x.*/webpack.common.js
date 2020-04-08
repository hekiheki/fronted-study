const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    index: './src/index.js',
    list: './src/list.js',
    article: './src/article.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader'
        }],
        publicPath: '../'  // 给背景图片设置一个公共路径
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'sass-loader'
        }, {
          loader: 'postcss-loader'
        }],
        publicPath: '../'  // 给背景图片设置一个公共路径
      })

    }, {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|jpeg|svg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000, 
          outputPath: 'images'
        }
      }]
    }]
  },
  plugins: [
    new webpack.BannerPlugin('杭州网版权所有'),
    new HtmlWebpackPlugin({
      title: '首页',
      filename: './index.html',
      inject: 'body',
      chunks: ['index'],
      minify:{
        removeComments:false,
        collapseWhitespace:false
      },
      template: path.join(__dirname, '/src/index.template.html')
    }),
    new HtmlWebpackPlugin({
      title: '列表页',
      filename: './list.html',
      inject: 'body',
      chunks: ['list'],
      minify:{
        removeComments:false,
        collapseWhitespace:false
      },
      template: path.join(__dirname, '/src/list.template.html')
    }),
    new HtmlWebpackPlugin({
      title: '文章页',
      filename: './article.html',
      inject: 'body',
      chunks: ['article'],
      minify:{
        removeComments:false,
        collapseWhitespace:false
      },
      template: path.join(__dirname, '/src/article.template.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('css/[name].[hash].css')
  ]
}