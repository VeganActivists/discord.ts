/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { left } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import CommandError from '../../lib/types/error/command-error.js';

/**
 * Pings Discord.
 */
export default class CommandErrorCommand extends BotCommand {
  /**
   * {@inheritdoc}
   * @param context - the context of the command.
   */

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['cerr', 'cerror'],
      description: 'Should fail with a command error.',
      detailedDescription:
        'For testing back end, this command should fail with a command error.',
      name: 'commandError',
      preconditions: ['DeveloperOnly'],
    });
  }

  /**
   * @param message - The message calling the command.
   * @returns - An error.
   */
  readonly messageRun = async (message: Message): Promise<CommandEither> =>
    left(
      new CommandError(
        `${this.name} failed after being called by ${message.author.tag}`,
      ),
    );
}
