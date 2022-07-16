/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { left } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import InternalError from '../../lib/types/error/internal-error.js';

/**
 * Pings Discord.
 */
export default class InternalErrorCommand extends BotCommand {
  /**
   * {@inheritdoc}
   * @param context - the context of the command.
   */

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['ierr', 'ierror'],
      description: 'Should fail with an internal error.',
      detailedDescription:
        'For testing back end, this command should fail with an internal error.',
      name: 'internalError',
      preconditions: ['DeveloperOnly'],
    });
  }

  /**
   * @param message - The message calling the command.
   * @returns - An error.
   */

  readonly messageRun = async (message: Message): Promise<CommandEither> =>
    left(
      new InternalError(
        `${this.name} failed after being called by ${message.author.tag}`,
      ),
    );
}
