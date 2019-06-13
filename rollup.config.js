import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

function config({ format, minify, input }) {
  const dir = `dist/`;
  const minifierSuffix = minify ? '.min' : '';
  const ext = 'js';
  return {
    external: ['react', 'use-resize-observer'],
    input: `./src/${input}.ts`,
    output: {
      name: 'useElementFit',
      file: `${dir}${input}${minifierSuffix}.${ext}`,
      format,
      sourcemap: true,
    },
    plugins: [
      typescript({
        clean: true,
        typescript: require('typescript'),
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
          },
          files: ['./src/index.ts'],
        },
      }),
      minify
        ? terser({
            sourcemap: true,
            compress: true,
            mangle: true,
          })
        : undefined,
    ].filter(Boolean),
  };
}

require('rimraf').sync('dist');

export default [
  { input: 'index', format: 'umd', minify: false },
  { input: 'index', format: 'umd', minify: true },
].map(config);
