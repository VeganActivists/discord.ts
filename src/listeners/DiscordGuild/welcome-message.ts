/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import {
  AnyChannel,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { getRedditImage, RedditPost } from '../../lib/scripts/fetch-reddit.js';
import InternalError from '../../lib/types/error/internal-error.js';
import CHANNELS from '../../lib/veganActivists/channels.js';

type AnimalResponse = {
  readonly fact: string;
  readonly image: string;
};

const AVAILABLE = [
  'panda',
  'dog',
  'cat',
  'fox',
  'red_panda',
  'koala',
  'birb',
  'raccoon',
  'kangaroo',
  'whale',
];

export default class WelcomeMessageEvent extends Listener<
  typeof Events.GuildMemberAdd
> {
  constructor(context: PieceContext) {
    super(context, {
      event: Events.GuildMemberAdd,
    });
  }

  async run(member: GuildMember): Promise<Message | undefined> {
    return this.container.client.channels
      .fetch(CHANNELS.WELCOME)
      .then((fetchedChannel) =>
        ((testChannel: AnyChannel | null): testChannel is TextChannel =>
          testChannel instanceof Object && testChannel.isText())(fetchedChannel)
          ? fetchedChannel
          : Promise.reject(),
      )
      .then((welcomeChannel) =>
        Promise.all([
          welcomeChannel,
          // eslint-disable-next-line promise/no-nesting
          getRedditImage().catch((error) =>
            error instanceof InternalError
              ? fetch(
                  `https://some-random-api.ml/animal/${
                    AVAILABLE[Math.floor(Math.random() * AVAILABLE.length)] ??
                    'dog'
                  }`,
                  {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                    },
                  },
                )
              : Promise.reject(error),
          ),
        ]),
      )
      .then(([welcomeChannel, animalResponse]) =>
        Promise.all([
          welcomeChannel,
          animalResponse instanceof Response
            ? animalResponse.json()
            : animalResponse,
        ]),
      )
      .then(([welcomeChannel, animalResponseJson]) =>
        // eslint-disable-next-line total-functions/no-unsafe-readonly-mutable-assignment
        Promise.all([
          welcomeChannel,
          ((testAnimalResponse): testAnimalResponse is AnimalResponse =>
            typeof testAnimalResponse === 'object' &&
            'fact' in testAnimalResponse &&
            'image' in testAnimalResponse)(animalResponseJson)
            ? animalResponseJson
            : // eslint-disable-next-line ternary/nesting, ternary/no-unreachable
            ((testJsonResponse): testJsonResponse is RedditPost =>
                typeof testJsonResponse === 'object' &&
                'url' in testJsonResponse &&
                'url' in testJsonResponse)(animalResponseJson)
            ? {
                image:
                  animalResponseJson.url ??
                  'https://bunnies.media/poster/40.png',
                fact:
                  animalResponseJson.title ??
                  `Remember to check out the role selection channel for more options too!`,
              }
            : {
                image: 'https://bunnies.media/poster/40.png',
                fact: `Remember to check out the role selection channel for more options too!`,
              },
        ]),
      )
      .then(async ([welcomeChannel, animalResponse]) =>
        welcomeChannel.send({
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: member.guild.name,
                url: 'https://discord.gg/vegans',
                iconURL: member.guild.iconURL() ?? '',
              })
              .setColor('GREEN')
              .setDescription(
                `Hi <@${member.id}>, Thank you for joining the Vegan Activists community! Please use this channel for animal rights discussion.`,
              )
              .addField(
                'Rules and Conduct',
                `Please make sure to visit our rules here: <#${CHANNELS.RULES}>.\n`,
              )
              .addField(
                'Vegan Status Roles',
                'Please select whether you are a vegan or not below.',
              )
              .setFooter({
                text: animalResponse.fact,
              })
              .setImage(animalResponse.image)
              .setThumbnail(member.displayAvatarURL())
              .setTitle('Welcome!')
              .setURL('https://discord.gg/vegans'),
          ],
          components: [
            new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId('addVegan')
                .setEmoji('🌱')
                .setLabel('Vegan')
                .setStyle('SUCCESS'),
              new MessageButton()
                .setCustomId('addNonVegan')
                .setEmoji('🔪')
                .setLabel('Not Vegan')
                .setStyle('DANGER'),
              new MessageButton()
                .setCustomId('addAnimal')
                .setEmoji(await member.guild.emojis.fetch('993763656288436304'))
                .setStyle('PRIMARY'),
            ]),
          ],
        }),
      );
  }
}
