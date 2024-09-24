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
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { webpackImageConvert } =require('@yuanjianming/unplugin-image-convert')
// const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
// const DashboardPlugin = require('webpack-dashboard/plugin')
// const WebpackObfuscator = require('../plugins/webpack-obfuscator-plugin.js')
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

const WebpackObfuscator = require('webpack-obfuscator');

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
  // devtool: 'source-map',
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
      // new ImageMinimizerPlugin({
      //   // deleteOriginalAssets:false,
      //   minimizer: {
         
      //     implementation: ImageMinimizerPlugin.sharpMinify,
      //     options: {
      //       encodeOptions: {
      //         jpeg: {
      //           // https://sharp.pixelplumbing.com/api-output#jpeg
      //           quality: 100,
      //         },
      //         webp: {
      //           // https://sharp.pixelplumbing.com/api-output#webp
      //           lossless: true,
      //         },
      //         avif: {
      //           // https://sharp.pixelplumbing.com/api-output#avif
      //           lossless: true,
      //         },

      //         // png by default sets the quality to 100%, which is same as lossless
      //         // https://sharp.pixelplumbing.com/api-output#png
      //         png: {
      //           lossless:true,
      //           quality:90
      //         },

      //         // gif does not support lossless compression at all
      //         // https://sharp.pixelplumbing.com/api-output#gif
      //         gif: {},
      //       },
      //     },
      //   },
      //   generator: [
      //     {
      //       // You can apply generator using `?as=webp`, you can use any name and provide more options
      //       type: "asset",
      //       filename: `[name].[id][ext]`,
      //       implementation: ImageMinimizerPlugin.sharpGenerate,
      //       options: {
      //         encodeOptions: {
      //           webp: {
      //             lossless:true
      //           },
      //         },
      //       },
      //     },
      //     {
      //       // You can apply generator using `?as=webp`, you can use any name and provide more options
      //       preset: "avif",
      //       implementation: ImageMinimizerPlugin.sharpGenerate,
      //       options: {
      //         encodeOptions: {
      //           avif: {
      //             lossless:true
      //           },
      //         },
      //       },
      //     },
      //   ],
      // }),
     
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
        // "src/assets/images/**/*.png",
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: (source) => {
            return !source.includes('index.html') // 忽略index.html
          },
        },
      ],
    }),
    new DuplicatePackageCheckerPlugin({
      verbose: true,
    }), // 检测是否有重复依赖
    webpackImageConvert(),
    new WebpackObfuscator({
      compact: true,//紧凑输出
      controlFlowFlattening: true,//启用代码控制流扁平化。控制流扁平化是源代码的结构转换，它阻碍了程序的理解
      controlFlowFlatteningThreshold: 1,
      sourceMap:false,
      numbersToExpressions: true,//支持将数字转换为表达式
      simplify: true,//简化
      stringArrayShuffle: true,//随机随机排列 stringArray 数组项
      splitStrings: true,//将文本字符串拆分为具有选项值长度的
      debugProtection:true, //会使得浏览器的开发者工具变得不稳定，防止代码被调试。
      stringArray:true, //会将字符串放入一个特殊的数组中，通过索引访问，以增加代码的混淆程度。
      deadCodeInjection:false //会在代码中插入不会被执行的死代码，增加反向工程的难度。
    }),
  ],
})

module.exports = webpackConfig
