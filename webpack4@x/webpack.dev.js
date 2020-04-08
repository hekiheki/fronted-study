const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devServer: {
    contentBase: './dist',
    port: "8088",  // 设置端口号为8088
    inline: true,  // 文件修改后实时刷新
    historyApiFallback: true, //不跳转
    hot: true     //热加载
  }
})