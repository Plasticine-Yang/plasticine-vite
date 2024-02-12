import type {
  LoadResult,
  PartialResolvedId,
  ResolvedId,
  PluginContext as RollupPluginContext,
  SourceDescription,
} from 'rollup'

import type { Plugin } from '@/plugin'

import type { PluginContainer } from './types'

/**
 * 插件上下文对象 - 这里仅实现上下文对象的 resolve 方法
 */
export class PluginContext implements Pick<RollupPluginContext, 'resolve'> {
  constructor(private pluginContainer: PluginContainer) {}

  async resolve(id: string, importer?: string) {
    let out = await this.pluginContainer.resolveId(id, importer)
    if (typeof out === 'string') out = { id: out }
    return out as ResolvedId | null
  }
}

export class PluginContainerImpl implements PluginContainer {
  constructor(private plugins: Plugin[]) {}

  async resolveId(id: string, importer?: string | undefined): Promise<PartialResolvedId | null> {
    const ctx = new PluginContext(this)

    for (const plugin of this.plugins) {
      if (plugin.resolveId) {
        const resolvedId = await plugin.resolveId.call(ctx, id, importer)

        if (resolvedId) {
          id = typeof resolvedId === 'string' ? resolvedId : resolvedId.id
          return { id }
        }
      }
    }

    return null
  }

  async load(id: string): Promise<LoadResult> {
    const ctx = new PluginContext(this)

    for (const plugin of this.plugins) {
      if (plugin.load) {
        const loadResult = await plugin.load.call(ctx, id)

        if (loadResult) {
          return loadResult
        }
      }
    }

    return null
  }

  async transform(code: string, id: string): Promise<SourceDescription | null> {
    const ctx = new PluginContext(this)
    let transformedCode = code

    for (const plugin of this.plugins) {
      if (plugin.transform) {
        const result = await plugin.transform.call(ctx, code, id)

        if (!result) continue
        if (typeof result === 'string') {
          transformedCode = result
        } else if (result.code) {
          transformedCode = result.code
        }
      }
    }

    return { code: transformedCode }
  }
}
