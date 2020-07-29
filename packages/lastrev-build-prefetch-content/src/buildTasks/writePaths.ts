import { getStaticSlugsForContentType } from '@last-rev/integration-contentful';
import _ from 'lodash';

import { CONTENT_DIR, PATHS_FILE } from '../constants';
import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildConfig, TypeSlugsTuple, BuildTask } from '../types';

const writePathsJs = async (buildConfig: BuildConfig, ...typeSlugsTuples: TypeSlugsTuple[]) => {
  const paths = {};
  _.each(typeSlugsTuples, ([type, slugs]) => {
    paths[type] = _.map(slugs, (slug) => {
      const out = {};
      const configPaths = buildConfig.paths;
      out[configPaths[type]] = slug;
      return { params: out };
    });
  });

  const out = `export default ${JSON.stringify(paths, null, 2)};`;
  await writeFile(PATHS_FILE, out);
};

const getStaticSlugs = async (contentType: string): Promise<[string, string[]]> => {
  const slugs = await getStaticSlugsForContentType({ contentTypeId: contentType });
  return [contentType, slugs];
};

const getStaticSlugFunctions = (buildConfig: BuildConfig): Promise<[string, string[]]>[] => {
  if (!buildConfig || !buildConfig.paths) return [];
  return _.map(_.keys(buildConfig.paths), (conf) => {
    return getStaticSlugs(conf);
  });
};

const writePaths: BuildTask = async (buildConfig): Promise<void> => {
  await mkdirIfNotExists(CONTENT_DIR);

  const staticSlugFunctions = getStaticSlugFunctions(buildConfig);

  const [...typeSlugTuples]: [...TypeSlugsTuple[]] = (await Promise.all([...staticSlugFunctions])) as [
    ...TypeSlugsTuple[]
  ];
  await writePathsJs(buildConfig, ...typeSlugTuples);
};

export default writePaths;
