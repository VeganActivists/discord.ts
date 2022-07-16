/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { PieceContext } from '@sapphire/framework';
import { bold, compose, underline } from 'discord-md-tags';
import { MessageEmbed } from 'discord.js';
import { right } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import BotResult from '../../lib/types/bot-result.js';
import { ReadonlyDiscordEmbedField } from '../../lib/types/util.js';

export default class AboutCommand extends BotCommand {
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['a', 'vabot', 'botinfo', 'vabotinfo', 'bot'],
      name: 'about',
      description: 'Sends details about the Vegan Activists Bot.',
      detailedDescription:
        'Prints out detailed information for the Vegan Activists Bot. Includes a bot invite, discord server invite, source code, social media, donation pages, and version information.',
    });
  }

  async messageRun(): Promise<CommandEither> {
    return right(
      new BotResult(
        'Printed Vegan Activist Bot Details',
        new MessageEmbed()
          .setAuthor({
            name:
              process.env['npm_package_name'] ??
              this.container.client.user?.username ??
              'Vegan Activists',
            iconURL: this.container.client.user?.displayAvatarURL() ?? '',
          })
          .setColor('AQUA')
          .setDescription(
            'the Vegan Activists Bot is a feature-rich Discord Bot written in TypeScript with modern frameworks and highly opinionated style choices. In particular it is programmed by the Vegan Activist Community to help create a functional animal liberation platform on Discord.',
          )
          .setFooter({
            text: 'The Vegan Activists Bot is programmed under the MIT License',
          })
          .setThumbnail(
            // eslint-disable-next-line no-secrets/no-secrets
            'https://media.discordapp.net/attachments/960625603193753603/996958404855734333/VeganActivists.png',
          )
          .setTitle('Vegan Activists Discord Bot')
          .setURL('https://github.com/VeganActivists/ts-bot')
          .addFields(
            [
              {
                name: 'Invites',
                value: `🔗 [Join the Vegan Activists Discord](https://discord.gg/vegans)`,
              },
              {
                name: 'Source',
                value:
                  '🐙 [Github](https://github.com/VeganActivists/ts-bot)\n',
              },
              {
                name: 'Socials',
                value:
                  // eslint-disable-next-line no-secrets/no-secrets -- For YouTube
                  '▶️ [TikTok](https://www.tiktok.com/@vegan.activists)\n' +
                  '📷 [Instagram](https://www.instagram.com/vegan_activists_/)\n' +
                  '🐦 [Twitter](https://twitter.com/vegan_activists)\n' +
                  '📧 E-mail: VeganActivists@proton.me',
              },
              {
                name: 'Developers',
                value: ['💙 <@789937509383143455> - Lead Engineer'].join('\n'),
              },
              {
                name: 'Version',
                value: `${
                  process.env['COMMIT'] ??
                  process.env['npm_package_version'] ??
                  'No Version Information Available'
                }`,
              },
            ].map((field: ReadonlyDiscordEmbedField) => ({
              name: compose(bold, underline)`${field.name}`,
              value: field.value,
            })),
          ),
        {
          printResult: false,
          sendPayload: true,
        },
      ),
    );
  }
}
