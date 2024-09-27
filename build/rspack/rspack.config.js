const { getEntryTemplate } = require('./utils/helper')
const { separator } = require('./utils/constant')
const packages = process.env.packages.split(separator)
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')
const { entry, htmlPlugins } = getEntryTemplate(packages)
const isDev = process.env.NODE_ENV === 'development'
const rspack = require('@rspack/core');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const env =
    process.env.MODE === 'development'
        ? require('../../config/dev.env')
        : process.env.MODE === 'preview'
            ? require('../../config/preview.env')
            : require('../../config/prod.env')
module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
    devServer: {
        port: 3000, // 服务端口号
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: true, // 开启热更新，后面会讲react模块热替换具体配置
        historyApiFallback: true, // 解决history路由404问题
        static: {
            directory: path.join(__dirname, '../../public'), //托管静态资源public文件夹
        },
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
            },
        ],
    },
    entry, // 入口文件
    output: {
        filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
        path: path.join(__dirname, '../../dist'), // 打包结果输出路径
        clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
        publicPath: isDev ? '/' : './', // 打包后文件的公共前缀路径
    },
    optimization: {
        nodeEnv: false,
        // minimize: false, // Disabling minification because it takes too long on CI
        // usedExports: true, //收集的信息由其他优化或代码生成使用，即不为未使用的导出
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
            new rspack.SwcJsMinimizerRspackPlugin(),
            new rspack.LightningCssMinimizerRspackPlugin(),
        ],
        // minimizer:[] 默认使用 rspack.SwcJsMinimizerRspackPlugin 和 rspack.LightningCssMinimizerRspackPlugin
    },
    cache: true,
    module: {
        rules: [
            {
                resourceQuery: /\?raw/,
                type: 'asset/source'
            },
            {
                test: /\.ts$/,
                loader: 'builtin:swc-loader', // 非 utf8 字符 会编译异常 ，例如图片
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                        },
                    },
                },
                type: 'javascript/auto',
            },
            {
                test: /\.jsx$/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'ecmascript',
                                jsx: true,
                            },
                        },
                    },
                },
                type: 'javascript/auto',
            },
            {
                test: /\.tsx$/,
                use: {
                    loader: 'builtin:swc-loader',// 非 utf8 字符 会编译异常 ，例如图片
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                            transform: {
                                react: {
                                    development: isDev,
                                    refresh: isDev,
                                },
                            },
                        },
                    },
                },
                type: 'javascript/auto',
            },
            //  postcss-loader 读取 postcss.config.js 配置加载
            {
                test: /.css$/, //匹配所有的 css 文件
                include: [path.resolve(__dirname, '../../src')],
                use: [
                    isDev ? 'style-loader' : rspack.CssExtractRspackPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /.less$/, //匹配所有的 less 文件
                include: [path.resolve(__dirname, '../../src')],
                use: [
                    isDev ? 'style-loader' : rspack.CssExtractRspackPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64位
                    },
                },
                generator: {
                    filename: 'static/images/[name].[contenthash][ext]', // 加上[contenthash:8]
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
        ]
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts', '.tsx'],
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': path.join(__dirname, '../../src'),
        },
        tsConfig: path.resolve(__dirname, '../../tsconfig.json'),
        modules: [path.resolve(__dirname, '../../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
    },
    plugins: [
        isDev && new ReactRefreshPlugin(),
        new rspack.ProgressPlugin(),
        new rspack.DefinePlugin({
            'process.env': env,
        }),
        ...htmlPlugins,
        new rspack.CssExtractRspackPlugin({
            filename: 'static/css/[name].[contenthash:8].css', // 加上[contenthash:8]
        }),
        new CompressionPlugin({
            test: /.(js|css)$/, // 只生成css,js压缩文件
            filename: '[path][base].gz', // 文件命名
            algorithm: 'gzip', // 压缩格式,默认是gzip
            test: /.(js|css)$/, // 只生成css,js压缩文件
            threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
            minRatio: 0.8, // 压缩率,默认值是 0.8
        }),
        !isDev && new rspack.CopyRspackPlugin({
            patterns: [
                // "src/assets/images/**/*.png",
                {
                    from: path.resolve(__dirname, '../../public'), // 复制public下文件
                    to: path.resolve(__dirname, '../../dist'), // 复制到dist目录中
                    filter: (source) => {
                        return !source.includes('index.html') // 忽略index.html
                    },
                },
            ],
        })
    ].filter(Boolean),
}