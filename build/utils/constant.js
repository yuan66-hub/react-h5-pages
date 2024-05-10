/*
 * @Author: 'yuanjianming' '1743394015@qq.com'
 * @Date: 2022-11-14 10:28:14
 * @LastEditors: 'yuanjianming' '1743394015@qq.com'
 * @LastEditTime: 2022-11-14 10:35:26
 * @FilePath: \react-demo-h5\build\utils\constant.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 规定固定的入口文件名 packages/**/main.tsx
const MAIN_FILE = 'main.tsx'
const chalk = require('chalk')

// 固定端口
const BASE_PROT = 9000

// 多页面入口文件夹中的路径
const PAGESPATH = '../../src/pages'

// 打印时颜色
const error = chalk.bold.red
const warning = chalk.hex('#FFA500')
const success = chalk.green

const maps = {
  success,
  warning,
  error,
}

// 因为环境变量的注入是通过字符串方式进行注入的
// 所以当 打包多个文件时 我们通过*进行连接 比如 home和editor 注入的环境变量为home*editor
// 注入多个包环境变量时的分隔符
const separator = '*'

const log = (message, types) => {
  console.log(maps[types](message))
}

module.exports = {
  MAIN_FILE,
  log,
  separator,
  BASE_PROT,
  PAGESPATH,
}
