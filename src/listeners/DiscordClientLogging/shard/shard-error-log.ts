/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class ShardErrorLoggingEvent extends Listener<
  typeof Events.ShardError
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardError,
    });
  }

  async run(error: Readonly<Error>, shardID: number): Promise<void> {
    return this.container.logger.error(
      `ID: [${shardID}] - Name: [${error.name}] - Message: [${
        error.message
      }] - Trace: [${error.stack ?? 'no stack trace.'}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.ERROR,
    );
  }
}
