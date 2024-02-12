import esbuild from 'esbuild'
import { readFile } from 'fs-extra'
import path from 'path'

import { isJSRequest } from '@/helpers'
import { Plugin } from '@/plugin'

export function internalPluginEsbuildTransform(): Plugin {
  return {
    name: 'esbuild-transform',

    // 加载模块
    async load(id) {
      if (isJSRequest(id)) {
        try {
          const code = await readFile(id, 'utf-8')
          return code
        } catch (e) {
          return null
        }
      }
    },

    async transform(code, id) {
      if (isJSRequest(id)) {
        const extname = path.extname(id).slice(1)
        const { code: transformedCode, map } = await esbuild.transform(code, {
          target: 'esnext',
          format: 'esm',
          sourcemap: true,
          loader: extname as 'js' | 'ts' | 'jsx' | 'tsx',
        })

        return {
          code: transformedCode,
          map,
        }
      }

      return null
    },
  }
}
