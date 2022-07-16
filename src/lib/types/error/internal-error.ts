/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

/**
 * Represents an error that occurred in the internal code, and is not an error on the User's behalf.
 */
export default class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalError';
    this.message = message;
  }
}
