/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class ShardReadyLoggingEvent extends Listener<
  typeof Events.ShardReady
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardReady,
    });
  }

  async run(
    shardID: number,
    unavailableGuilds: ReadonlySet<string> | undefined,
  ): Promise<void> {
    return this.container.logger.debug(
      `ID: [${shardID}] - Unavailable: [${
        unavailableGuilds?.size ?? 'No Unavailable Data Given'
      }]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.READY,
    );
  }
}
