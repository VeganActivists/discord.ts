/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import {
  MessageCommandDeniedPayload,
  Listener,
  Events,
  PieceContext,
  UserError,
} from '@sapphire/framework';
import { Message } from 'discord.js';

export default class MessageCommandDeniedLoggingEvent extends Listener<
  typeof Events.MessageCommandDenied
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandDenied,
    };
    super(context, options);
  }

  public readonly run = (
    error: Readonly<UserError>,
    { message, command }: MessageCommandDeniedPayload,
  ): Promise<Message> =>
    message.reply(
      `${command.name} is unavailable because ${error.message} - ${this.name}`,
    );
}
