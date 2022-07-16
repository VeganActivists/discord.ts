/* eslint-disable header/header, functional/no-return-void, class-methods-use-this */
/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { ILogger, LogLevel } from '@sapphire/framework';
import logger from './index.js';

export enum BotLogLevel {
  /**
   * The lowest log level, used when calling {@link ILogger.trace}.
   */
  Trace = 10,
  /**
   * The debug level, used when calling {@link ILogger.debug}.
   */
  Debug = 20,
  /**
   * The info level, used when calling {@link ILogger.info}.
   */
  Info = 30,
  /**
   * The warning level, used when calling {@link ILogger.warn}.
   */
  Warn = 40,
  /**
   * The error level, used when calling {@link ILogger.error}.
   */
  Error = 50,
  /**
   * The critical level, used when calling {@link ILogger.fatal}.
   */
  Fatal = 60,
  /**
   * An unknown or uncategorized level.
   */
  None = 100,
}

export default class BotLogger implements ILogger {
  public readonly level: BotLogLevel;

  public constructor(level: BotLogLevel) {
    this.level = level;
  }

  readonly trace = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.silly(message, { topic, event }, values);
  };

  readonly silly = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.silly(message, { topic, event }, values);
  };

  readonly input = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.input(message, { topic, event }, values);
  };

  readonly verbose = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.verbose(message, { topic, event }, values);
  };

  readonly prompt = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.prompt(message, { topic, event }, values);
  };

  readonly debug = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.debug(message, { topic, event }, values);
  };

  readonly info = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.info(message, { topic, event }, values);
  };

  readonly data = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.data(message, { topic, event }, values);
  };

  readonly help = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.help(message, { topic, event }, values);
  };

  readonly warn = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.warn(message, { topic, event }, values);
  };

  readonly error = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.error(message, { topic, event }, values);
  };

  readonly fatal = (
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.error(message, { topic, event }, values);
  };

  readonly write = (
    level: LogLevel,
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void => {
    logger.info(message, { topic, event }, level, values);
  };

  public has(level: LogLevel): boolean {
    return level >= this.level;
  }
}
/* eslint-enable header/header, functional/no-return-void, class-methods-use-this */
