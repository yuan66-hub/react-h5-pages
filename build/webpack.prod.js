/*
 * @Author: 'yuanjianming' '1743394015@qq.com'
 * @Date: 2022-11-14 10:10:25
 * @LastEditors: 'yuanjianming' '1743394015@qq.com'
 * @LastEditTime: 2022-11-15 16:24:00
 * @FilePath: \react-demo-h5\build\webpack.prod.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
// const DashboardPlugin = require('webpack-dashboard/plugin')

const globAll = require('glob-all')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const glob = require('glob')
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const PATHS = {
  src: path.join(__dirname, '../src'),
}
const webpackConfig = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  devtool: false,
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 4, // 根据浏览器内核设置并行请求数
      // 分隔代码
      cacheGroups: {
        react: {
          // 提取node_modules代码
          test: /[\\/]node_modules[\\/]react[\\/]/, // 只匹配node_modules里面的模块
          name: 'react', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
          // enforce: true, //强制执行
          reuseExistingChunk: true, // 重用已有的模块
        },
        reactDom: {
          // 提取页面公共代码
          test: /[\\/]node_modules[\\/]react-dom[\\/]/, // 只匹配node_modules里面的模块
          name: 'react-dom', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: -1, // 提取优先级为1
          // enforce: true, //强制执行
          reuseExistingChunk: true, // 重用已有的模块
        },
      },
    },
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'], // 删除console.log
          },
        },
      }),
    ],
  },
  plugins: [
    // new StaticSiteGeneratorPlugin({
    //   paths: ['/home.html'],
    //   crawl: true,
    // }),
    //  文件压缩 gzip
    // new DashboardPlugin(),
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      test: /.(js|css)$/, // 只生成css,js压缩文件
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: (source) => {
            return !source.includes('index.html') // 忽略index.html
          },
        },
      ],
    }),
  ],
})

module.exports = webpackConfig
