/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

import { NODE_DEVELOPMENT } from '../../config.js';

enum TestChannels {
  ROLES = '996969704306520150',
  RULES = '996969704306520149',
  WELCOME = '996969704499462254',
}

enum Channels {
  ROLES = '993085448811446292',
  RULES = '993178560120496158',
  WELCOME = '993108327343079536',
}

export default process.env['NODE_ENV'] === NODE_DEVELOPMENT
  ? TestChannels
  : Channels;
