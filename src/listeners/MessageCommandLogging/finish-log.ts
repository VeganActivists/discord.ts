/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import {
  MessageCommandFinishPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';
import BotCommand from '../../lib/types/bot-command.js';

export default class MessageCommandFinishLoggingEvent extends Listener<
  typeof Events.MessageCommandFinish
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandFinish,
    };
    super(context, options);
  }

  public async run(
    message: Message,

    command: BotCommand,

    payload: MessageCommandFinishPayload,
  ): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${
        message.content
      }] - Parameters: [${payload.parameters.toString()}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_FINISHED,
    );
  }
}
