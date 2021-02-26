/* eslint-disable no-console */
import { AdapterConfig } from '@last-rev/adapter-contentful';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PROJECT_ROOT } from './constants';
import getBuildTasks from './buildTasks';
import { BuildTask, BuildConfig } from './types';
import resolveConfig from './helpers/resolveConfig';
import mkdirIfNotExists from './helpers/mkDirIfNotExists';
import prefetchAllContent from './helpers/prefetchAllContent';

console.log('Running lr-prefetch from project root:', PROJECT_ROOT);

const { adapter: adapterConfig, build: buildConfig } = JSON.parse(
  readFileSync(resolve(PROJECT_ROOT, './.lastrevrc'), 'utf-8')
) as { adapter: AdapterConfig; build: BuildConfig };

const build = async (): Promise<void> => {
  const resolvedConfig = resolveConfig(buildConfig);
  const buildTasks: BuildTask[] = getBuildTasks(resolvedConfig);
  // if writing content JSON, we will use this opportunity to call this first, and put the contentful data in memory
  // in order to optimize subsequent build tasks.
  let preloadedContent;
  if (buildConfig.writeContentJson) {
    preloadedContent = await prefetchAllContent(resolvedConfig);
  }
  await mkdirIfNotExists(buildConfig.outputDirectory);
  await Promise.all(_.map(buildTasks, (buildTask) => buildTask(resolvedConfig, preloadedContent, { adapterConfig })));
};

export default build;
