import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

function config({ format, minify, input, bundle }) {
  const dir = `dist/`;
  const bundleSuffix = bundle ? '.bundle' : '';
  const minifierSuffix = minify ? '.min' : '';
  const ext = 'js';

  const external = bundle ? ['react'] : ['react', 'use-resize-observer', 'resize-observer-polyfill'];

  return {
    external: external,
    input: `./src/${input}.ts`,
    output: {
      name: 'useElementFit',
      file: `${dir}${input}${bundleSuffix}${minifierSuffix}.${ext}`,
      format,
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonJS({
        include: 'node_modules/**',
      }),
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
  { input: 'index', format: 'umd', minify: false, bundle: false },
  { input: 'index', format: 'umd', minify: true, bundle: false },
  { input: 'index', format: 'umd', minify: false, bundle: true },
  { input: 'index', format: 'umd', minify: true, bundle: true },
].map(config);
