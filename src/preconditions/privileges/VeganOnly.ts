/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { AllFlowsPrecondition } from '@sapphire/framework';
import {
  Message,
  GuildMember,
  Role,
  CacheType,
  CommandInteraction,
  ContextMenuInteraction,
} from 'discord.js';
import ROLES from '../../lib/veganActivists/roles.js';

declare module '@sapphire/framework' {
  interface Preconditions {
    readonly VeganOnly: never;
  }
}

export default class VeganOnlyPrecondition extends AllFlowsPrecondition {
  public override async messageRun(message: Message<boolean>) {
    return message.member
      ? this.checkIfVegan(message.member)
      : this.notGuildError();
  }

  public override async chatInputRun(
    interaction: CommandInteraction<CacheType>,
  ) {
    return interaction.member instanceof GuildMember
      ? this.checkIfVegan(interaction.member)
      : this.notGuildError();
  }

  public override async contextMenuRun(
    interaction: ContextMenuInteraction<CacheType>,
  ) {
    // eslint-disable-next-line ternary/no-unreachable
    return interaction.member instanceof GuildMember
      ? this.checkIfVegan(interaction.member)
      : this.notGuildError();
  }

  private async checkIfVegan(member: GuildMember) {
    return !member.roles.cache.some(
      (role: Readonly<Role>) => role.id === ROLES.VEGAN,
    )
      ? this.error({
          message: 'This command can only be used by vegans.',
        })
      : this.ok();
  }

  private async notGuildError() {
    return this.error({ message: 'This command can only be used in a guild.' }); // TODO: Fetch from Guild
  }
}
