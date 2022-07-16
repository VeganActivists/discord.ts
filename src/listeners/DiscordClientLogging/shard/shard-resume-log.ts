/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class ShardResumeLoggingEvent extends Listener<
  typeof Events.ShardResume
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardResume,
    });
  }

  async run(id: number, replayedEvents: number): Promise<void> {
    return this.container.logger.debug(
      `ID: [${id} - Replayed Event Count: [${replayedEvents}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.ERROR,
    );
  }
}
