/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

const fs = require('fs-extra');
const {cyan} = require('ansi-colors');
const {downloadDistExperimentOutput, timedExecOrDie} = require('./utils');
const FILENAME = 'experiment-tests-helper.js';

process.on('message', async ({experiment, port}) => {
  process.env.PORT = port;
  console.log('Creating workspace for', cyan(experiment));
  process.chdir('../');
  const dir = `amphtml_${experiment}`;
  await fs.remove(dir);
  await fs.copy('amphtml', dir);
  process.chdir(dir);

  console.log('Done. Running', cyan(experiment), 'tests...');
  timedExecOrDie('gulp clean');
  downloadDistExperimentOutput(FILENAME, experiment);
  timedExecOrDie('gulp update-packages');
  //timedExecOrDie('gulp integration --nobuild --compiled --headless');
  timedExecOrDie('gulp e2e --nobuild --headless');

  // manually exit child process
  process.exit();
});
