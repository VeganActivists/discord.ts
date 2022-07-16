/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

/* eslint-disable no-console */

import { build } from 'esbuild';
import { globby } from 'globby';
import packageConfig from '../package.json' assert { type: 'json' };
import 'dotenv/config';

const buildDirectory = 'dist';
const bundle = process.env.BUNDLE === 'true';
const startTime = performance.now();
console.log(bundle ? 'Bundling...' : 'Building...');

globby(`src/**/*.ts`)
  .then((files) => ({
    // eslint-disable-next-line ternary/no-unreachable
    entryPoints: bundle ? ['./src/index.ts'] : files,
    bundle,
    platform: 'node',
    loader: { '.ts': 'ts' },
    tsconfig: './src/tsconfig.esbuild.json',
    /* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
    // eslint-disable-next-line ternary/no-unreachable
    external: bundle
      ? [
          ...Object.keys(packageConfig.dependencies ?? {}),
          ...Object.keys(packageConfig.devDependencies ?? {}),
          ...Object.keys(packageConfig.peerDependencies ?? {}),
        ]
      : undefined,
    /* eslint-enable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
  }))
  .then((shared) =>
    Promise.all([
      build({
        ...shared,
        outdir: `${buildDirectory}`,
        format: 'esm',
      }),
      ...(process.env.BUILDALL === 'true'
        ? [
            build({
              ...shared,
              outdir: `${buildDirectory}/cjs`,
              format: 'cjs',
            }),
            build({
              ...shared,
              minify: true,
              outdir: `${buildDirectory}/minify`,
              format: 'esm',
            }),
            build({
              ...shared,
              minify: true,
              outdir: `${buildDirectory}/minify/cjs`,
              format: 'cjs',
            }),
          ]
        : []),
    ]),
  )
  .then((jobs) =>
    console.log(
      // eslint-disable-next-line ternary/no-unreachable
      `Finished ${bundle ? 'bundling' : 'building'} \u001B[36m${
        jobs.length
      }\u001B[0m job${jobs.length > 0 ? '' : 's'} in \u001B[1;32m${
        performance.now() - startTime
      }\u001B[0mms`,
    ),
  )
  .catch((error) => console.error(error));
/* eslint-enable no-console */
