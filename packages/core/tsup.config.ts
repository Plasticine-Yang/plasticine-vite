import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    cli: 'src/cli/index.ts',
  },
  outDir: 'dist',
  format: ['cjs', 'esm'],
  target: 'esnext',
  dts: true,
  clean: true,
  shims: true,
  sourcemap: true,
})
