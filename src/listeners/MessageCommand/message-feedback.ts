/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { match } from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import { BotCommandSuccessPayload } from '../../lib/types/bot-command.js';
import BotResult from '../../lib/types/bot-result.js';

export default class MessageCommandFeedbackEvent extends Listener<
  typeof Events.MessageCommandSuccess
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandSuccess,
    };
    super(context, options);
  }

  readonly run = ({
    command,
    message,
    result,
  }: BotCommandSuccessPayload): Promise<Message<boolean> | undefined> =>
    pipe(
      result,
      match(
        (error: Readonly<Error>) =>
          message.reply({
            embeds: [
              new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription(error.message)
                .setFooter({ text: `from ${command.name} on ${this.name}` }),
            ],
          }),
        (botCommandResult: BotResult) =>
          (botCommandResult.options.sendPayload
            ? message.reply(botCommandResult.payload)
            : new Promise(() => {})
          ).then(() =>
            botCommandResult.options.printResult
              ? message.reply(botCommandResult.message)
              : new Promise(() => {}),
          ),
      ),
    );
}
