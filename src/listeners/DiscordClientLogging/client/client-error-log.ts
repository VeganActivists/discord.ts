/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class DiscordErrorLoggingEvent extends Listener<
  typeof Events.Error
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Error,
    });
  }

  async run(error: Readonly<Error>): Promise<void> {
    return this.container.logger.error(
      `[${error.name}] - [${error.message}] - [${
        error.stack ?? 'no stack trace.'
      }]`,
      TOPICS.DISCORD,
      EVENTS.ERROR,
    );
  }
}
