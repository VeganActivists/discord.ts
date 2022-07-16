/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Shard, ShardingManager } from 'discord.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DeepReadonly } from 'ts-essentials';
import EVENTS from './lib/logger/events.js';
import logger from './lib/logger/index.js';
import TOPICS from './lib/logger/topics.js';

const BOT_PATH = `${path.dirname(fileURLToPath(import.meta.url))}/bot.js`;
const manager = new ShardingManager(BOT_PATH, {
  token: process.env['DISCORD_TOKEN'] ?? '',
});

/**
 * @returns never - The process should end after this.
 */
const kill = (): never =>
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(process.env['NODE_ENV'] === 'ci' ? 0 : 1);

manager.on('shardCreate', (shard: DeepReadonly<Shard>) => {
  logger.debug(`Launched shard ${shard.id}`, {
    topic: TOPICS.DISCORD_SHARD,
    event: EVENTS.INIT,
  });
  shard.on('message', (message: string) =>
    message === 'processKill' ? kill() : Promise.resolve(),
  );
});

const shardManagerCollection = manager.spawn();
export default shardManagerCollection;
