/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import {
  PreMessageCommandRunPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';

export default class MessagePreCommandRunLoggingEvent extends Listener<
  typeof Events.PreMessageCommandRun
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.PreMessageCommandRun,
    };
    super(context, options);
  }

  public async run({
    message,
    command,
  }: PreMessageCommandRunPayload): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_PRE_RUN,
    );
  }
}
