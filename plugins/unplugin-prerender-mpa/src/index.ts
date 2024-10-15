import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
    name: 'unplugin-prerender-mpa',
    webpack(compiler) {
        compiler.hooks.done.tap('unplugin-prerender-mpa', async () => {
            /**
             *  1. 启动无头浏览器返回html
             *  2. 使用fs模块生成文件到dist文件夹
             */
        })
    },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin