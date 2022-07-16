/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Command } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { right } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import BotResult from '../../lib/types/bot-result.js';

/**
 * Pings Discord.
 */
export default class PingCommand extends BotCommand {
  /**
   * {@inheritdoc}
   * @param context - the context of the command.
   */

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['gateway', 'latency'],
      description: 'Sends the ping and latency of the Bot.',
      detailedDescription:
        'Calculates a full round trip for the Discord websocket.',
      name: 'ping',
    });
  }

  /**
   * @param message - The message calling the command.
   * @returns - A promise that resolves to the result of the command, either an Embed with the ping and latency, or an error.
   */

  async messageRun(message: Message): Promise<CommandEither> {
    return message.channel
      .send('Ping?')

      .then((pingMessage) => pingMessage.delete())

      .then((deletedMessage) =>
        right(
          new BotResult(
            `Pong! Bot Latency ${Math.round(
              this.container.client.ws.ping,
            )}ms. API Latency ${
              deletedMessage.createdTimestamp - message.createdTimestamp
            }ms.`,
            new MessageEmbed()
              .setAuthor({
                name:
                  this.container.client.user?.username ?? 'Vegan ACtivists Bot',
              })
              .setColor('RANDOM')
              .setDescription(
                `Details for __**${
                  this.container.client.ws.gateway ?? 'gateway'
                }**__`,
              )
              .addFields([
                {
                  name: 'Bot Latency',
                  value: `${Math.round(this.container.client.ws.ping)}ms`,
                  inline: true,
                },
                {
                  name: 'API Latency',
                  value: `${
                    deletedMessage.createdTimestamp - message.createdTimestamp
                  }ms`,
                  inline: true,
                },
              ]),
            { printResult: false, sendPayload: true },
          ),
        ),
      );
  }
}
