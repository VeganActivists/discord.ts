/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { config, createLogger, format, Logform, transports } from 'winston';
import DiscordTransport from './discord-transport.js';
import NullTransport from './null-transport.js';
import 'winston-daily-rotate-file';

const logger = createLogger({
  levels: config.cli.levels,
  format: format.combine(
    format.label({ label: `Vegan Activists Bot (${process.pid})` }),
    format.errors({ stack: true }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ level: true, message: true }),
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf((info: Logform.TransformableInfo): string => {
          const {
            timestamp,
            label,
            level,
            topic,
            event,
            ...rest
          }: Logform.TransformableInfo & {
            readonly event?: string;
            readonly label?: string;
            readonly message?: string;
            readonly topic?: string;
          } = info;
          return `\u001B[7m${level}\u001B[0m ${
            typeof timestamp === 'string' ? timestamp : 'NO TIMESTAMP'
          } from \u001B[2m\u001B[36m${label ?? ''}\u001B[0m for ${
            event ?? 'NO EVENT GIVEN'
          } in ${topic ?? 'NO TOPIC GIVEN'} ⇒ ${
            typeof info.message === 'string' ? info.message : 'No Event Message'
          } ${Object.keys(rest).length > 0 ? JSON.stringify(rest) : ''}`;
        }),
      ),
      level: process.env['NODE_ENV'] === 'development' ? 'verbose' : 'debug',
    }),
    new transports.DailyRotateFile({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      ),
      level: 'debug',
      dirname: './logs/',
      filename: 'VeganActivistsBot-%DATE%.log',
      maxFiles: '30d',
    }),
    process.env['NO_DISCORD']
      ? new NullTransport({})
      : new DiscordTransport({
          webhookUrl: process.env['WEBHOOK'] ?? '',
          level: 'info',
        }),
    new transports.File({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      ),
      filename: 'debugging.log',
      dirname: './logs/',
      level: process.env['NODE_ENV']?.localeCompare('development')
        ? 'silly'
        : 'help',
    }),
  ],
  exitOnError: true,
});

export default logger;
