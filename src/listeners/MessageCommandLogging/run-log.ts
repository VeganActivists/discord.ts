/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import {
  MessageCommandRunPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';
import BotCommand from '../../lib/types/bot-command.js';

export default class MessageCommandRunLoggingEvent extends Listener<
  typeof Events.MessageCommandRun
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandRun,
    };
    super(context, options);
  }

  public async run(
    message: Message,

    command: BotCommand,

    payload: MessageCommandRunPayload,
  ): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${
        message.content
      }] - Parameters: [${payload.parameters.toString()}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_RUN,
    );
  }
}
