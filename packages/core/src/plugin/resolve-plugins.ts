import {
  internalPluginEsbuildTransform,
  internalPluginImportAnalysis,
  internalPluginResolveRequestPath,
} from '@/internal-plugins'

import type { Plugin } from './types'

const internalPlugins: Plugin[] = [
  internalPluginResolveRequestPath(),
  internalPluginEsbuildTransform(),
  internalPluginImportAnalysis(),
]

export function resolvePlugins(): Plugin[] {
  return [...internalPlugins]
}
