/*
 * @Author: 'yuanjianming' '1743394015@qq.com'
 * @Date: 2022-11-14 10:28:41
 * @LastEditors: 'yuanjianming' '1743394015@qq.com'
 * @LastEditTime: 2022-11-14 12:22:54
 * @FilePath: \react-demo-h5\build\utils\helper.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { MAIN_FILE, PAGESPATH } = require('./constant')

const cdn = {
  js: [],
  css: [],
}

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'
// 检查数组是否为空
const isEmptyArray = (arr) => Array.isArray(arr) & (arr.length === 0)

// 获取多页面入口文件夹中的路径
const dirPath = path.resolve(__dirname, PAGESPATH)

// 用于保存入口文件的Map对象
const entry = Object.create(null)

// 读取dirPath中所有的的文件夹个数
// 同时保存到entry中  key为文件夹名称 value为文件夹路径
fs.readdirSync(dirPath).filter((file) => {
  const entryPath = path.join(dirPath, file)
  if (fs.statSync(entryPath)) {
    entry[file] = path.join(entryPath, MAIN_FILE)
  }
})

// 根据入口文件list生成对应的htmlWebpackPlugin
// 同时返回对应wepback需要的入口和htmlWebpackPlugin
const getEntryTemplate = (packages) => {
  const entry = Object.create(null)
  const htmlPlugins = []
  packages.forEach((packageName) => {
    entry[packageName] = path.join(dirPath, packageName, MAIN_FILE)
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, '../../public/index.html'),
        filename: `${packageName}.html`,
        chunks: ['manifest', 'vendors', packageName],
        cdn: isProduction ? cdn : [],
      })
    )
  })
  return { entry, htmlPlugins }
}

module.exports = {
  entry,
  getEntryTemplate,
  isEmptyArray,
}
