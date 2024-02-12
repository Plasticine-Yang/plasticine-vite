// connect 是一个具有中间件机制的轻量级 Node.js 框架。
// 既可以单独作为服务器，也可以接入到任何具有中间件机制的框架中，如 Koa、Express
import connect from 'connect'
// picocolors 是一个用来在命令行显示不同颜色文本的工具
import picocolors from 'picocolors'

import { optimize } from '@/optimizer'
import { resolvePlugins } from '@/plugin'
import { PluginContainerImpl } from '@/plugin-container'

import type { ServerContext } from './types'
import { middlewareIndexHtml, middlewareTransform } from './middlewares'

const { blue, green } = picocolors

export async function startDevServer(root: string) {
  const app = connect()
  const startTime = Date.now()
  const plugins = resolvePlugins()
  const pluginContainer = new PluginContainerImpl(plugins)

  const serverContext: ServerContext = {
    root,
    app,
    pluginContainer,
    plugins,
  }

  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext)
    }
  }

  // 处理入口 html
  app.use(middlewareIndexHtml(serverContext))

  // 转译文件
  app.use(middlewareTransform(serverContext))

  app.listen(3000, async () => {
    await optimize(root)

    console.log(green('🚀 No-Bundle 服务已经成功启动!'), `耗时: ${Date.now() - startTime}ms`)
    console.log(`> 本地访问路径: ${blue('http://localhost:3000')}`)
  })
}
