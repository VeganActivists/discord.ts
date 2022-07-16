/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import os from 'node:os';
import { MessageBuilder, Webhook } from 'webhook-discord';
import Transport, { TransportStreamOptions } from 'winston-transport';
import Colors from '../types/colors.js';

/**
 * Options for Discord transport for winston
 */
type DiscordTransportOptions = TransportStreamOptions & {
  readonly discord?: boolean;
  readonly webhookUrl: string;
};

/**
 * Elements of a log message for winston
 */
type LoggerElements = Record<string, unknown> & {
  readonly error: string;
  readonly event: string;
  readonly label: string;
  readonly level: string;
  readonly message: string;
  readonly timestamp: string;
  readonly topic: string;
};

/**
 * Transport for winston to send logs to a Discord Webhook
 */
export default class DiscordTransport extends Transport {
  /** Available colors for discord messages */
  private static readonly colorCodes: { readonly [key: string]: number } = {
    error: Colors.DARK_RED,
    warn: Colors.RED,
    help: Colors.DARK_ORANGE,
    data: Colors.YELLOW,
    info: Colors.DARK_GREEN,
    debug: Colors.GREEN,
    prompt: Colors.DARK_BLUE,
    verbose: Colors.DARK_BLUE,
    input: Colors.DARK_PURPLE,
    silly: Colors.PURPLE,
  };

  /** Webhook obtained from Discord */
  private readonly webhook: Webhook;

  /**
   *
   * @param options - Options for the transport
   */
  public constructor(options: DiscordTransportOptions) {
    super(options);
    this.webhook = new Webhook(options.webhookUrl);
  }

  /**
   * Winston function for logging messages
   * @param info - Log message from winston
   * @param callback - Callback to winston to complete the log
   */
  public override log(
    info: Readonly<LoggerElements>,
    // eslint-disable-next-line functional/no-return-void
    callback: () => void,
    // eslint-disable-next-line functional/no-return-void
  ): void {
    this.webhook
      .send(
        new MessageBuilder()
          .setName('Vegan Activists Bot')
          .setTitle(info.level.toUpperCase())
          .setAuthor(info.label)
          .setDescription(info.message ?? '')
          .setColor(
            `#${(
              DiscordTransport.colorCodes[info.level] ?? Colors.DEFAULT
            ).toString(16)}`,
          )
          .addField('Host', os.hostname()),
      )
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
    return callback();
  }
}
