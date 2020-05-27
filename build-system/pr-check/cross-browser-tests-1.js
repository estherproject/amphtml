/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const colors = require('ansi-colors');
const {
  startTimer,
  stopTimer,
  timedExecOrDie: timedExecOrDieBase,
} = require('./utils');
const {determineBuildTargets} = require('./build-targets');

const FILENAME = 'cross-browser-tests.js';
const FILELOGPREFIX = colors.bold(colors.yellow(`${FILENAME}:`));
const timedExecOrDie = (cmd) => timedExecOrDieBase(cmd, FILENAME);

// async function main() {
//   const startTime = startTimer(FILENAME, FILENAME);

//   const buildTargets = determineBuildTargets(FILENAME);
//   if (
//     !buildTargets.has('RUNTIME') &&
//     !buildTargets.has('FLAG_CONFIG') &&
//     !buildTargets.has('UNIT_TEST') &&
//     !buildTargets.has('INTEGRATION_TEST')
//   ) {
//     console.log(
//       `${FILELOGPREFIX} Skipping`,
//       colors.cyan('Remote (Sauce Labs) Tests'),
//       'because this commit does not affect the runtime, flag configs,',
//       'unit tests, or integration tests.'
//     );
//     stopTimer(FILENAME, FILENAME, startTime);
//     return;
//   }
//   timedExecOrDie('gulp update-packages');
//   timedExecOrDie('gulp dist --fortesting');

//   if (buildTargets.has('RUNTIME') || buildTargets.has('UNIT_TEST')) {
//     timedExecOrDie('gulp unit --nobuild');
//   }

//   if (
//     buildTargets.has('RUNTIME') ||
//     buildTargets.has('FLAG_CONFIG') ||
//     buildTargets.has('INTEGRATION_TEST')
//   ) {
//     timedExecOrDie('gulp integration --nobuild --compiled --headless');
//     // timedExecOrDie(
//     //     'gulp integration --nobuild --compiled --saucelabs --beta'
//     // );
//   }

//   stopTimer(FILENAME, FILENAME, startTime);
// }

//main();

const startTime = startTimer(FILENAME, FILENAME);
timedExecOrDie('gulp unit --nobuild --headless --compiled');
stopTimer(FILENAME, FILENAME, startTime);
