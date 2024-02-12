import { build } from 'esbuild'
import { resolve } from 'path'
import picocolors from 'picocolors'

import { preBundle, scanDependencies } from '@/esbuild-plugins'

import { PRE_BUNDLE_DIR } from './constants'

const { green } = picocolors

interface OptimizeOptions {
  /** @default "root/src/main.tsx" */
  entry?: string
}

export async function optimize(root: string, options?: OptimizeOptions) {
  const { entry } = options ?? {}

  // 1. 确定入口
  const resolvedEntry = entry ?? resolve(root, 'src/main.tsx')

  // 2. 从入口处扫描依赖
  const deps = new Set<string>()
  await build({
    entryPoints: [resolvedEntry],
    bundle: true,
    write: false,
    plugins: [scanDependencies(deps)],
  })

  console.log(
    `${green('需要预构建的依赖')}:\n${[...deps]
      .map(green)
      .map((item) => `  ${item}`)
      .join('\n')}`,
  )

  // 3. 预构建依赖
  await build({
    entryPoints: [...deps],
    outdir: resolve(root, PRE_BUNDLE_DIR),
    write: true,
    bundle: true,
    format: 'esm',
    splitting: true,
    plugins: [preBundle(root, deps)],
  })
}
