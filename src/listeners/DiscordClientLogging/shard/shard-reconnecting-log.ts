/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class ShardReconnectingLoggingEvent extends Listener<
  typeof Events.ShardReconnecting
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardReconnecting,
    });
  }

  async run(id: number): Promise<void> {
    return this.container.logger.debug(
      `ID: [${id}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.RECONNECTING,
    );
  }
}
