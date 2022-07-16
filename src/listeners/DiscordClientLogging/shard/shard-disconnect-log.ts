/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { CloseEvent } from 'discord.js';
import { DeepReadonly } from 'ts-essentials';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class ShardDisconnectLoggingEvent extends Listener<
  typeof Events.ShardDisconnect
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardDisconnect,
    });
  }

  async run(
    closeEvent: DeepReadonly<CloseEvent>,
    shardID: number,
  ): Promise<void> {
    return this.container.logger.debug(
      `ID: [${shardID}] - Code: [${closeEvent.code}] - Reason: [${closeEvent.reason}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.DISCONNECT,
    );
  }
}
