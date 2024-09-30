import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/*.ts'],
    sourcemap: false,
    clean: true,
    format:["cjs","esm"],
    shims: false,
    splitting: false,
    dts: true // 生成声明文件
})