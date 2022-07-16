/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import {
  MessageCommandAcceptedPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';

export default class MessageCommandAcceptedLoggingEvent extends Listener<
  typeof Events.MessageCommandAccepted
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandAccepted,
    };
    super(context, options);
  }

  public async run({
    message,
    command,
  }: MessageCommandAcceptedPayload): Promise<void> {
    return this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_ACCEPTED,
    );
  }
}
