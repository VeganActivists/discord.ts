/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
  coverageProvider: 'v8',
  displayName: 'Vegan Activist Bot Unit Tests',
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.(t|j)sx?$': 'esbuild-jest',
  },
});
