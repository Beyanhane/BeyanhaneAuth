import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index':          'src/index.ts',
    'tokens/index':   'src/tokens/index.ts',
    'session/index':  'src/session/index.ts',
    'crypto/index':   'src/crypto/index.ts',
    'errors/index':   'src/errors/index.ts',
    'types/index':    'src/types/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
})