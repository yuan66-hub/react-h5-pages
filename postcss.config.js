module.exports = {
  plugins: [
    require('tailwindcss'), // css 原子化
    require('autoprefixer'), // css 属性  默认 兼容.browserslistrc or package.json "browserslist"
    require('postcss-px-to-viewport')({
      viewportWidth: 750, // 定义转换时的 基准宽度（ui设计稿的宽度）
      unitPrecision: 2, // 计算时保留的最大小数位数
      viewportUnit: 'vw', // 转换后的基础单位
      selectorBlackList: ['.ignore', '.hairlines'], // 定义项目中不需要转换样式
      minPixelValue: 1, // 定义转换时的 最小值接线
      mediaQuery: false, // 被定义在 @media 不进行转换操作
      exclude: /(\/|\\)(node_modules)(\/|\\)/, // node_modules 文件夹中的样式不进行转换
    }),
  ],
}
