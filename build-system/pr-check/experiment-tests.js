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
'use strict';

/**
 * @fileoverview
 * This script runs remote experiments tests.
 * This is run during the CI stage = test; job = experiments tests.
 */

const childProcess = require('child_process');
const experimentsConfig = require('../global-configs/experiments-config.json');
const {cyan} = require('ansi-colors');
const {startTimer, stopTimer} = require('./utils');
const FILENAME = 'experiment-tests.js';

/**
 * Runs a suite of tests for each experiment in parallel child
 * processes. Prints stdout at the very end for each process.
 * @return {Promise<void>}
 */
async function runExperimentTests_() {
  const promises = [];
  Object.keys(experimentsConfig).forEach(experiment => {
    const config = experimentsConfig[experiment];

    if (!config.command) {
      return;
    }

    let resolver;
    promises.push(
      new Promise(resolverIn => {
        resolver = resolverIn;
      })
    );
    console.log('Starting tests for', cyan(experiment), '...');
    const child = childProcess.fork(
      'build-system/pr-check/experiment-tests-helper.js',
      {silent: true}
    );

    const output = [];
    const errors = [];
    child.send({
      experiment,
      port: config.port,
    });
    child.stdout.on('data', data => {
      output.push(data);
    });
    child.stderr.on('data', data => {
      errors.push(data);
    });

    child.on('exit', exitCode => {
      console.log('');
      output.forEach(o => {
        process.stdout.write(o);
      });
      errors.forEach(e => {
        process.stderr.write(e);
      });
      console.log(cyan(experiment), 'exited with code', cyan(exitCode));
      resolver();
    });
  });
  return Promise.all(promises);
}

async function main() {
  const startTime = startTimer(FILENAME, FILENAME);
  await runExperimentTests_();
  stopTimer(FILENAME, FILENAME, startTime);
}

main();
