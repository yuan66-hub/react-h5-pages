const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UnpluginInjectPreload = require('unplugin-inject-preload/webpack')
// https://github.com/Tofandel/prerenderer/tree/master 无头浏览器渲染生成html输出到文件系统
// const PrerendererWebpackPlugin = require('@prerenderer/webpack-plugin')
// const PrerendererWebpackPlugin = require('../plugins/prerenderer-webpack-plugin')
// const { webpackPlugin } = require('../plugins/unplugin-watch-file.cjs')
// const WebpackObfuscator = require('webpack-obfuscator');

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式

const { separator } = require('./utils/constant')
const { getEntryTemplate } = require('./utils/helper')

// 将packages拆分成为数组 ['editor','home']
const packages = process.env.packages.split(separator)

// 调用getEntryTemplate 获得对应的entry和htmlPlugins
const { entry, htmlPlugins } = getEntryTemplate(packages)

const WebpackBar = require('webpackbar') // 打包进度条

const env =
  process.env.MODE === 'development'
    ? require('../config/dev.env')
    : process.env.MODE === 'preview'
    ? require('../config/preview.env')
    : require('../config/prod.env')

module.exports = {
  // 通过webpack 注释变量分包下载，避免入口文件体积过大
  entry, // 入口文件
  optimization: {
    nodeEnv: false,
    minimize: true,
    usedExports: true, //收集的信息由其他优化或代码生成使用，即不为未使用的导出
  },
  // 打包文件出口
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: isDev ? '/' : './', // 打包后文件的公共前缀路径
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, '../src')], //只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx|js|jsx)$/, // 匹配.ts, tsx文件
        //  babel-loader 读取 babel.config.js 配置加载
        use: ['thread-loader', 'babel-loader'],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      //  postcss-loader 读取 postcss.config.js 配置加载
      {
        test: /.css$/, //匹配所有的 css 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: (resourcePath) => resourcePath.endsWith('.module.css'),  // 匹配.less文件来进行css模块化。
                localIdentName: '[local]_[hash:base64:10]',
              },
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /.less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: (resourcePath) => resourcePath.endsWith('.module.less'),  // 匹配.less文件来进行css模块化。
                localIdentName: '[local]_[hash:base64:10]',
              },
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.tsx'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': path.join(__dirname, '../src'),
    },
    modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new WebpackBar(),
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css', // 加上[contenthash:8]
    }),
    ...htmlPlugins,
    // webpackPlugin(),
    // new PrerendererWebpackPlugin(),
    UnpluginInjectPreload({
        files:[
          {
            entryMatch: /\.(png)$/,
            outputMatch:/\.(png)$/,
            attributes: {
              'type': 'image/png',
              'as': 'image',
              'fetchpriority':'high',
              'crossorigin': 'anonymous',
            }
        }
      ],
      // injectTo: 'head-prepend'
    })
  ],
}
