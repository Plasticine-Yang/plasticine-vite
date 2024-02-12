import type { Plugin } from 'esbuild'

import { EXTERNAL_TYPES } from './constants'
import { DEPENDENCY_PACKAGE_RE } from '../constants'

/** 依赖扫描 */
export function scanDependencies(deps: Set<String>): Plugin {
  return {
    name: 'scan-dependencies',
    setup(build) {
      // 忽略无需让 esbuild 处理的文件
      build.onResolve({ filter: new RegExp(`\\.${EXTERNAL_TYPES.join('|')}$`) }, (args) => {
        return {
          path: args.path,
          external: true,
        }
      })

      // 记录依赖
      build.onResolve({ filter: DEPENDENCY_PACKAGE_RE }, (args) => {
        const { path } = args

        deps.add(path)

        return {
          path,
          external: true,
        }
      })
    },
  }
}
