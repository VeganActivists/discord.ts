/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import {
  ButtonInteraction,
  GuildMember,
  Interaction,
  MessageEmbed,
} from 'discord.js';
import { getRedditImage } from '../../lib/scripts/fetch-reddit.js';
import ROLES from '../../lib/veganActivists/roles.js';

export default class WelcomeRoleSelectionEvent extends Listener<
  typeof Events.InteractionCreate
> {
  constructor(context: PieceContext) {
    super(context, {
      event: Events.InteractionCreate,
    });
  }

  async run(
    interaction: Interaction,
  ): Promise<void | GuildMember | readonly [GuildMember] | undefined> {
    return !((
      testInteraction: Interaction,
    ): testInteraction is ButtonInteraction => testInteraction.isButton())(
      interaction,
    ) || !interaction.guild
      ? Promise.resolve()
      : // eslint-disable-next-line ternary/nesting
      interaction.customId === 'addAnimal'
      ? getRedditImage().then((redditPost) =>
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor('GREEN')
                .setDescription(redditPost.title)
                .setImage(redditPost.url)
                .setURL(`https://reddit.com${redditPost.permalink}`)
                .setTitle('Extra Animal Fact'),
            ],
            ephemeral: true,
          }),
        )
      : this.container.client.guilds
          .fetch(interaction.guild?.id)
          .then((fetchedGuild) =>
            fetchedGuild.members.fetch(interaction.user.id),
          )
          .then((fetchedMember) =>
            !((testGuildMember): testGuildMember is GuildMember =>
              testGuildMember instanceof GuildMember)(fetchedMember) ||
            !(
              interaction.customId === 'addVegan' ||
              interaction.customId === 'addNonVegan'
            ) ||
            fetchedMember.roles.cache.some((role) =>
              [
                ROLES.VEGAN,
                interaction.customId === 'addVegan'
                  ? ROLES.UNVERIFIED_VEGAN
                  : ROLES.NONVEGAN,
              ]
                .map((test) => test.toString())
                .includes(role.id),
            )
              ? Promise.reject()
              : Promise.all([
                  fetchedMember,
                  interaction,
                  fetchedMember.roles.remove([
                    ROLES.NONVEGAN,
                    ROLES.UNVERIFIED_VEGAN,
                  ]),
                ]),
          )
          .then(([guildMember, buttonInteraction]) =>
            Promise.all([
              buttonInteraction,
              guildMember.roles.add(
                buttonInteraction.customId === 'addVegan'
                  ? ROLES.UNVERIFIED_VEGAN
                  : // eslint-disable-next-line ternary/nesting
                  buttonInteraction.customId === 'addNonVegan'
                  ? ROLES.NONVEGAN
                  : guildMember.guild.id,
              ),
            ]),
          )
          .then(([buttonInteraction]) =>
            // eslint-disable-next-line ternary/no-unreachable
            ['addVegan', 'addNonVegan'].includes(buttonInteraction.customId)
              ? buttonInteraction.reply({
                  content: `You're now a ${
                    // eslint-disable-next-line ternary/no-unreachable
                    buttonInteraction.customId === 'addVegan'
                      ? 'Vegan'
                      : 'Non Vegan'
                  }!`,
                  ephemeral: true,
                })
              : Promise.resolve(),
          );
  }
}
