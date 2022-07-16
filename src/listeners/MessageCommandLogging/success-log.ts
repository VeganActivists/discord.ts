/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext, Args } from '@sapphire/framework';

import { match } from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';
import { BotCommandSuccessPayload } from '../../lib/types/bot-command.js';

export default class MessageCommandSuccessLoggingEvent extends Listener<
  typeof Events.MessageCommandSuccess
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandSuccess,
    };
    super(context, options);
  }

  public async run({
    args,
    command,
    context,
    message,
    parameters,
    result,
  }: BotCommandSuccessPayload): Promise<void> {
    return ((messageCommandArguments): messageCommandArguments is Args =>
      typeof messageCommandArguments === 'object' &&
      messageCommandArguments !== null &&
      'repeatResult' in messageCommandArguments)(args)
      ? args
          .repeatResult('string')
          .then((resultString) =>
            resultString.success
              ? `Command: [${command.name}] - Message: [${
                  message.content
                }] - String Args: [${
                  resultString.value.toString() ?? ''
                }] - Command Prefix: [${
                  context.commandPrefix
                }] - Parameters: [${parameters.toString()}]`
              : `Command: [${command.name}] - Message: [${
                  message.content
                }] - Command Prefix: [${
                  context.commandPrefix
                }] - Parameters: [${parameters.toString()}]`,
          )
          .then((reportString) =>
            pipe(
              result,
              match(
                async (error: Readonly<Error>) =>
                  this.container.logger.error(
                    `${reportString} - User Error: [${error.message}]`,
                    TOPICS.SAPPHIRE,
                    EVENTS.COMMAND_ERROR,
                  ),
                async (botCommandResult) =>
                  this.container.logger.info(
                    `${reportString} - Result: [${botCommandResult.message}]`,
                    TOPICS.SAPPHIRE,
                    EVENTS.COMMAND_SUCCESS,
                  ),
              ),
            ),
          )
      : undefined;
  }
}
