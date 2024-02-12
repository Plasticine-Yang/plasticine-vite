import type { NextHandleFunction } from 'connect'
import fs from 'fs-extra'
import path from 'path'

import type { ServerContext } from '../types'

/** 处理入口 html 文件的中间件 */
export function middlewareIndexHtml(serverContext: ServerContext): NextHandleFunction {
  return async (request, response, next) => {
    const { root, plugins } = serverContext

    if (request.url === '/') {
      const indexHtmlPath = path.join(root, 'index.html')

      if (await fs.pathExists(indexHtmlPath)) {
        const rawIndexHtml = await fs.readFile(indexHtmlPath, 'utf8')
        let transformedIndexHtml = rawIndexHtml

        // 通过执行插件的 transformIndexHtml 方法来对 HTML 进行自定义的修改
        for (const plugin of plugins) {
          const { transformIndexHtml } = plugin

          if (transformIndexHtml) {
            transformedIndexHtml = await transformIndexHtml(transformedIndexHtml)
          }
        }

        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html')

        return response.end(transformedIndexHtml)
      }
    }

    return next()
  }
}
