/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, PieceContext } from '@sapphire/framework';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';

export default class NodeUnhandledRejectionLoggingEvent extends Listener<'unhandledRejection'> {
  constructor(context: PieceContext) {
    const options = {
      emitter: process,
      event: 'unhandledRejection',
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(error: Readonly<Error>): Promise<void> {
    return this.container.client.logger.warn(
      `[${error.name}] - [${error.message}] - [${error.stack ?? ''}]`,
      TOPICS.NODE,
      EVENTS.UNHANDLED_REJECTION,
    );
  }
}
