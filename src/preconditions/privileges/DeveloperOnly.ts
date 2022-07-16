/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { AllFlowsPrecondition } from '@sapphire/framework';
import {
  CommandInteraction,
  ContextMenuInteraction,
  Message,
} from 'discord.js';

declare module '@sapphire/framework' {
  interface Preconditions {
    readonly DeveloperOnly: never;
  }
}

export default class DeveloperOnlyPrecondition extends AllFlowsPrecondition {
  public override async messageRun(message: Message) {
    return this.checkIfDeveloper(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkIfDeveloper(interaction.user.id);
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    return this.checkIfDeveloper(interaction.user.id);
  }

  private async checkIfDeveloper(userId: string) {
    return !(process.env['DEVELOPER'] === userId)
      ? this.error({ message: 'Only developers can run this command' })
      : this.ok();
  }
}
