// babel.config.js
const isDEV = process.env.NODE_ENV === 'development' // 是否是开发模式

module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      '@babel/preset-env',
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        targets: {
          chrome: 45,
          ios: 9,
        },
        modules: 'auto',
        useBuiltIns: 'usage', // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js使用的版本
      },
    ],
    [
      '@babel/preset-react',
      {
        development: isDEV,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    isDEV && require.resolve('react-refresh/babel'), // 如果是开发模式,就启动react热更新插件
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true, // 对辅助函数的复用，解决es5冗余代码
        corejs: false, //防止 @babel/preset-env corejs转换函数冲突
        regenerator: false, //代码中没用到 Generator/async 函数，则不引入，设置false,防止 @babel/preset-env regenerator 函数冲突
      },
    ],
    // ?? 
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // 可选链 ?.
    '@babel/plugin-proposal-optional-chaining'
  ].filter(Boolean), // 过滤空值
}
