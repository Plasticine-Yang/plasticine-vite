import { pathExists } from 'fs-extra'
import path from 'path'
import resolve from 'resolve'

import { normalizePath } from '@/helpers'
import type { Plugin } from '@/plugin'
import type { ServerContext } from '@/server'

import { DEFAULT_EXTENSIONS } from './constants'

export function internalPluginResolveRequestPath(): Plugin {
  let serverContext: ServerContext

  return {
    name: 'resolve-request-path',

    configureServer(ctx) {
      // 保存服务端上下文
      serverContext = ctx
    },

    async resolveId(id: string, importer?: string) {
      const { root } = serverContext

      // 1. 绝对路径
      if (path.isAbsolute(id)) {
        if (await pathExists(id)) {
          return { id }
        }

        // 加上 root 路径前缀，处理 /src/main.tsx 的情况
        id = path.join(root, id)
        if (await pathExists(id)) {
          return { id }
        }
      }

      // 2. 相对路径
      else if (id.startsWith('.')) {
        if (!importer) {
          throw new Error('`importer` should not be undefined')
        }

        const hasExtension = path.extname(id).length > 1
        let resolvedId: string

        if (hasExtension) {
          // 2.1 包含文件名后缀 - 如 ./App.tsx
          resolvedId = normalizePath(resolve.sync(id, { basedir: path.dirname(importer) }))
          if (await pathExists(resolvedId)) {
            return { id: resolvedId }
          }
        } else {
          // 2.2 不包含文件名后缀 - 如 ./App
          // ./App -> ./App.tsx
          for (const extname of DEFAULT_EXTENSIONS) {
            try {
              const idWithExtension = `${id}${extname}`

              resolvedId = normalizePath(
                resolve.sync(idWithExtension, {
                  basedir: path.dirname(importer),
                }),
              )

              if (await pathExists(resolvedId)) {
                return { id: resolvedId }
              }
            } catch (e) {
              continue
            }
          }
        }
      }

      return null
    },
  }
}
