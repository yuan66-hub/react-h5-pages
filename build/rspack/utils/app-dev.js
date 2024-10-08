/*
 * @Author: 'yuanjianming' '1743394015@qq.com'
 * @Date: 2022-11-14 10:28:01
 * @LastEditors: 'yuanjianming' '1743394015@qq.com'
 * @LastEditTime: 2022-11-14 10:37:29
 * @FilePath: \react-demo-h5\build\utils\dev.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const inquirer = require('inquirer')
const execa = require('execa')
const { log, separator } = require('../../utils/constant')
const { entry, isEmptyArray } = require('../../utils/helper')

// 获取packages下的所有文件
const packagesList = [...Object.keys(entry)]

// 至少保证一个
if (isEmptyArray(packagesList)) {
  log('不合法目录，请检查src/packages/*/main.tsx', 'warning')
  return
}

// 同时添加一个全选
const allPackagesList = [...packagesList, 'all']

// 调用inquirer和用户交互
inquirer
  .prompt([
    {
      type: 'checkbox',
      message: '请选择需要启动的项目:',
      name: 'devLists',
      choices: allPackagesList, // 选项
      // 校验最少选中一个
      validate(value) {
        return !value.length ? new Error('至少选择一个项目进行启动') : true
      },
      // 当选中all选项时候 返回所有packagesList这个数组
      filter(value) {
        if (value.includes('all')) {
          return packagesList
        }
        return value
      },
    },
  ])
  .then((res) => {
    const message = `当前选中Page: ${res.devLists.join(' , ')}`
    // 控制台输入提示用户当前选中的包
    log(message, 'success')
    runParallel(res.devLists)
  })

// 调用打包命令
async function runParallel(packages) {
  // 当前所有入口文件
  const message = `开始启动: ${packages.join('-')}`
  log(message, 'success')
  log('\nplease waiting some times...', 'success')
  await build(packages)
}

// 真正打包函数
async function build(buildLists) {
  // 将选中的包通过separator分割
  const stringLists = buildLists.join(separator)
  // 调用通过execa调用webapck命令
  // 同时注意路径是相对 执行node命令的cwd的路径
  // 这里我们最终会在package.json中用node来执行这个脚本
  await execa('rspack', ['serve', '-c', './build/rspack/rspack.config.js'], {
    stdio: 'inherit',
    env: {
      packages: stringLists,
    },
  })
}
