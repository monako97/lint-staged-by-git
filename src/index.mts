import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { argv } from 'node:process';

import { stylelint as Stylelint } from '@moneko/stylelint';
import { ESLint } from 'eslint';

function parseArgs<T>(args: string[]): T {
  return Object.fromEntries(
    args.map(function (arg: string) {
      const kv: string[] = arg.split('=');
      let value: string | boolean | number = kv[1];

      if (value === void 0 || value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (/-?\d+(\.\d+)?([eE][+-]?\d+)?/.test(value)) {
        value = parseFloat(value);
      }
      return [kv[0].replace(/^--/, ''), value];
    }),
  ) as T;
}
type Args = {
  fix?: boolean;
  cache?: boolean;
  mode?: 'ci' | 'commit';
};
const args: Args = parseArgs<Args>(argv.slice(2));
const fix: boolean | undefined = args.fix;
const cache: boolean = args.cache || true;
const cwd: string = process.cwd();
const cachePath: string = join(cwd, 'node_modules/.cache');
const cmd = {
  // 最近一次提交的文件列表
  ci: ['diff', '--name-only', 'HEAD^', 'HEAD'],
  // commit缓冲区文件
  commit: ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
} as const;
const scriptRegExp = /.*(?<!\.d)\.(j|t|mj|mt|cj|ct)sx?$/;
const vueRegExp = /.*(?<!\.d)\.vue$/;
const styleRegExp = /.*(?<!\.d)\.(c|sc|sa|le)ss$/;
const child: SpawnSyncReturns<Buffer<ArrayBufferLike>> = spawnSync(
  'git',
  cmd[args.mode || 'ci'] || cmd.ci,
);
const lintFiles: string[] = child.stdout.toString().trim().split('\n');

export async function eslint() {
  console.log('ESLint runing...');
  console.time('ESLint');
  const lint = new ESLint({
    cache,
    cacheLocation: `${cachePath}/.eslintcache`,
    fix,
  });
  const scriptFiles = lintFiles.filter((f) => scriptRegExp.test(f) || vueRegExp.test(f));
  const results = await lint.lintFiles(scriptFiles);
  const formatter = await lint.loadFormatter('stylish');
  const output = await formatter.format(results);

  if (fix) {
    await ESLint.outputFixes(results);
  }
  if (output) {
    process.stdout.write(output);
  }
  const hasErrors = results.some((result) => result.errorCount > 0);

  console.timeEnd('ESLint');
  if (hasErrors) {
    process.exit(1);
  }
}

const styleFiles: string[] = lintFiles.filter((f) => styleRegExp.test(f) || vueRegExp.test(f));

export async function stylelint() {
  console.log('Stylelint runing...');
  console.time('Stylelint');
  const resp = await Promise.all(
    styleFiles.map(async (codeFilename) => {
      const code = await readFile(codeFilename, { encoding: 'utf-8' });
      const result = await Stylelint.lint({
        codeFilename,
        code,
        cache,
        cacheLocation: `${cachePath}/.stylelintcache`,
        fix,
        formatter: 'string',
      }).catch(console.log);

      return result;
    }),
  );
  let hasError = false;

  resp.forEach((result) => {
    if (result) {
      if (result.report) {
        process.stdout.write(result.report);
      }
      if (result.errored) {
        hasError = !!result.errored;
      }
    }
  });

  console.timeEnd('Stylelint');
  if (hasError) {
    process.exit(1);
  }
}
