import type { LoadResult, PartialResolvedId, SourceDescription } from 'rollup'

/** 模拟 Rollup 的插件机制 */
export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription | null>
}
