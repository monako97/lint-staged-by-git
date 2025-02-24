import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { argv } from 'node:process';
import { stylelint as Stylelint } from '@moneko/stylelint';
import { ESLint } from 'eslint';
declare function parseArgs<T>(args: string[]): T;
type Args = {
    fix?: boolean;
    cache?: boolean;
    mode?: 'ci' | 'commit';
};
declare const args: Args;
declare const fix: boolean | undefined;
declare const cache: boolean;
declare const cwd: string;
declare const cachePath: string;
declare const cmd: {
    readonly ci: readonly ['diff', '--name-only', 'HEAD^', 'HEAD'];
    readonly commit: readonly ['diff', '--cached', '--name-only', '--diff-filter=ACMR'];
};
declare const child: SpawnSyncReturns<Buffer<ArrayBufferLike>>;
declare const lintFiles: string[];
export declare async function eslint();
declare const styleFiles: string[];
export declare async function stylelint();
