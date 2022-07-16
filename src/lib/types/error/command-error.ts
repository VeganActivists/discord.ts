/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

/**
 * Represents an error that occurred due to a user's actions.
 */
export default class CommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommandError';
    this.message = message;
  }
}
