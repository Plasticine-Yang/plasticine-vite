import { LoadResult, PartialResolvedId, SourceDescription } from 'rollup'

import type { ServerContext } from '@/server'

export type ConfigureServerHook = (server: ServerContext) => (() => void) | void | Promise<(() => void) | void>

export type ResolveIdHook = (
  id: string,
  importer?: string,
) => Promise<PartialResolvedId | null> | PartialResolvedId | null

export type LoadHook = (id: string) => Promise<LoadResult | null> | LoadResult | null

export type TransformHook = (code: string, id: string) => Promise<SourceDescription | null> | SourceDescription | null

export type TransformIndexHtmlHook = (raw: string) => Promise<string> | string

export interface Plugin {
  name: string
  configureServer?: ConfigureServerHook
  resolveId?: ResolveIdHook
  load?: LoadHook
  transform?: TransformHook
  transformIndexHtml?: TransformIndexHtmlHook
}
