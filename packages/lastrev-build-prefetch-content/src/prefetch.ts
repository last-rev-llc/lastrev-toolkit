/* eslint-disable no-console */
import { AdapterConfig } from '@last-rev/adapter-contentful';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PROJECT_ROOT } from './constants';
import getBuildTasks from './buildTasks';
import { BuildTask, BuildConfig } from './types';
import resolveConfig from './helpers/resolveConfig';

console.log('project root', PROJECT_ROOT);

const { adapter: adapterConfig, build: buildConfig } = JSON.parse(
  readFileSync(resolve(PROJECT_ROOT, './.lastrevrc'), 'utf-8')
) as { adapter: AdapterConfig; build: BuildConfig };

const build = async (): Promise<void> => {
  const resolvedConfig = resolveConfig(buildConfig);
  const buildTasks: BuildTask[] = getBuildTasks(resolvedConfig);
  await Promise.all(_.map(buildTasks, (buildTask) => buildTask(resolvedConfig, { adapterConfig })));
};

export default build;
