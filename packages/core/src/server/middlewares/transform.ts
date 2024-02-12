import { NextHandleFunction } from 'connect'
import createDebug from 'debug'

import { cleanUrl, isJSRequest } from '@/helpers'
import { ServerContext } from '@/server/types'

import { SourceDescription } from 'rollup'

const debug = createDebug('dev')

export async function transformRequest(url: string, serverContext: ServerContext) {
  const { pluginContainer } = serverContext

  url = cleanUrl(url)

  // 简单来说，就是依次调用插件容器的 resolveId、load、transform 方法
  const resolveIdResult = await pluginContainer.resolveId(url)
  let transformResult: SourceDescription | null = null

  if (resolveIdResult?.id) {
    const loadResult = await pluginContainer.load(resolveIdResult.id)
    let code = ''

    if (typeof loadResult === 'string') {
      code = loadResult
    } else if (typeof loadResult === 'object' && loadResult !== null) {
      code = loadResult.code
    }

    if (code) {
      transformResult = await pluginContainer.transform(code, resolveIdResult?.id)
    }
  }

  return transformResult
}

export function middlewareTransform(serverContext: ServerContext): NextHandleFunction {
  return async (request, response, next) => {
    // 只处理静态资源
    if (request.method !== 'GET' || !request.url) {
      return next()
    }

    const url = request.url

    debug('transformMiddleware: %s', url)

    // transform JS request
    if (isJSRequest(url)) {
      const result = await transformRequest(url, serverContext)

      if (!result) {
        return next()
      }

      // 转译完成，返回响应给浏览器
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/javascript')

      return response.end(result.code)
    }

    next()
  }
}
