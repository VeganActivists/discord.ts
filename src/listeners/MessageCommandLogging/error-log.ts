/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import {
  MessageCommandErrorPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';

export default class MessageCommandErrorLoggingEvent extends Listener<
  typeof Events.MessageCommandError
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandError,
    };
    super(context, options);
  }

  public async run(
    error: Readonly<Error>,

    payload: MessageCommandErrorPayload,
  ): Promise<void> {
    return this.container.logger.warn(
      `Command: [${payload.command.name}] - Message: [${payload.message.content}] - Error Name: [${error.name}] -  Error Message: [${error.message}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_ERROR,
    );
  }
}
