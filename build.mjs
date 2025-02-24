import { convert } from '@moneko/convert';

const result = await convert({
  outDir: 'lib',
  inputDir: 'src',
  outputExtension: '.mjs',
  options: {
    module: {
      type: 'es6',
    },
    jsc: {
      parser: {
        syntax: 'typescript',
        decorators: true,
        dynamicImport: true,
      },
      target: 'esnext',
      loose: true,
      minify: {
        mangle: true,
        compress: true,
        format: {
          comments: 'some',
        },
      },
      experimental: {
        emitIsolatedDts: true,
      },
    },
    minify: true,
  },
});

result.failed.map((msg) => process.stdout.write(msg));
