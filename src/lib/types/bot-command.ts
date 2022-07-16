/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

// eslint-disable-next-line node/no-missing-import
import { sep } from 'node:path';
import {
  Command,
  Args,
  CommandOptions,
  PieceContext,
  MessageCommandSuccessPayload,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import { Either } from 'fp-ts/lib/Either.js';
import BotResult from './bot-result.js';

export type CommandEither = Either<Error, BotResult>;

export type BotCommandSuccessPayload = MessageCommandSuccessPayload & {
  readonly result: Awaited<Promise<CommandEither>>;
};

export default abstract class BotCommand extends Command {
  /**
   * The full category for the command
   *
   * @remarks since 0.0.1
   */
  public override readonly fullCategory: readonly string[];

  /**
   *
   * @param context - The context of the command from the Sapphire container
   * @param options - The options for the command
   */

  public constructor(context: PieceContext, options: CommandOptions) {
    super(context, options);

    const paths = context.path.split(sep);
    this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
  }

  /**
   *
   * @param message - The message that triggered the command
   * @param commandArguments - The arguments for the command
   */
  public abstract override messageRun(
    message: Message,

    commandArguments: Args,
  ): Promise<CommandEither> | CommandEither;
}
