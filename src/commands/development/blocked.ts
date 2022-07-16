/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Command } from '@sapphire/framework';
import { left } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import CommandError from '../../lib/types/error/command-error.js';

/**
 * Pings Discord.
 */
export default class BlockedCommand extends BotCommand {
  /**
   * {@inheritdoc}
   * @param context - the context of the command.
   */

  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['blocked'],
      description: 'Should not run.',
      detailedDescription: 'For testing back end, this command should not run.',
      name: 'blocked',
      preconditions: ['BlockedOnly'],
    });
  }

  /**
   * @param message - The message calling the command.
   * @returns - A promise that resolves to the result of the command, either an Embed with the ping and latency, or an error.
   */

  readonly messageRun = async (): Promise<CommandEither> => {
    return left(new CommandError(`${this.name} should not run`));
  };
}
