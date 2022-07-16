/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class DiscordWarnLoggingEvent extends Listener<
  typeof Events.Warn
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Warn,
    });
  }

  async run(info: string): Promise<void> {
    return this.container.logger.warn(info, TOPICS.DISCORD, EVENTS.WARN);
  }
}
