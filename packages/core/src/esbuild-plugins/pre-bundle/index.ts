import type { Loader, Plugin } from 'esbuild'

import createDebug from 'debug'
import { init, parse } from 'es-module-lexer'
import fs from 'fs-extra'
import { extname } from 'path'
import resolve from 'resolve'

import { DEPENDENCY_PACKAGE_RE } from '@/constants'
import { normalizePath } from '@/helpers'

const debug = createDebug('dev')

export function preBundle(root: string, deps: Set<String>): Plugin {
  return {
    name: 'pre-bundle',
    setup(build) {
      build.onResolve({ filter: DEPENDENCY_PACKAGE_RE }, (args) => {
        const { path, importer } = args
        const isEntry = !importer

        // 命中预构建依赖
        if (deps.has(path)) {
          return isEntry
            ? // 入口需要标记
              {
                path: '',
                namespace: 'dep',
              }
            : {
                path: resolve.sync(path, { basedir: root }),
              }
        }
      })

      // 拿到标记后的依赖，构造代理模块，交给 esbuild 打包
      build.onLoad(
        {
          filter: /.*/,
          namespace: 'dep',
        },
        async (args) => {
          await init
          const id = args.path
          const entryPath = normalizePath(resolve.sync(id, { basedir: root }))
          const code = await fs.readFile(entryPath, 'utf-8')
          const [imports, exports] = parse(code)
          const proxyModule = []

          if (!imports.length && !exports.length) {
            // cjs
            // 构造代理模块
            // 下面的代码后面会解释

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const res = require(entryPath)
            const specifiers = Object.keys(res)
            proxyModule.push(
              `export { ${specifiers.join(',')} } from "${entryPath}"`,
              `export default require("${entryPath}")`,
            )
          } else {
            // esm 格式比较好处理，export * 或者 export default 即可
            // @ts-ignore
            if (exports.includes('default')) {
              proxyModule.push(`import d from "${entryPath}";export default d`)
            }
            proxyModule.push(`export * from "${entryPath}"`)
          }

          debug('代理模块内容: %o', proxyModule.join('\n'))

          const loader = extname(entryPath).slice(1)

          return {
            loader: loader as Loader,
            contents: proxyModule.join('\n'),
            resolveDir: root,
          }
        },
      )
    },
  }
}
