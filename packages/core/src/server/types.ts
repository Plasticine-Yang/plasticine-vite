import connect from 'connect'

import type { Plugin } from '@/plugin'
import type { PluginContainer } from '@/plugin-container'

export interface ServerContext {
  root: string
  pluginContainer: PluginContainer
  app: connect.Server
  plugins: Plugin[]
}
