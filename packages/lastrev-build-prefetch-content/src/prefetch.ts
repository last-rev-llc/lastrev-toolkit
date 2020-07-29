/* eslint-disable no-console */
import { AdapterConfig } from '@last-rev/adapter-contentful';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PROJECT_ROOT } from './constants';
import getBuildTasks from './buildTasks';
import { BuildTask, BuildConfig } from './types';

console.log('project root', PROJECT_ROOT);

const { adapter: adapterConfig, build: buildConfig } = JSON.parse(
  readFileSync(resolve(PROJECT_ROOT, './.lastrevrc'), 'utf-8')
) as { adapter: AdapterConfig; build: BuildConfig };

const build = async (): Promise<void> => {
  const buildTasks: BuildTask[] = getBuildTasks(buildConfig);
  await Promise.all(_.map(buildTasks, (buildTask) => buildTask(buildConfig, { adapterConfig })));
};

export default build;
