import { getContentTypes } from '@last-rev/integration-contentful';
import { promisify } from 'util';
import { readdir as r } from 'fs';
import { relative } from 'path';
import slash from 'slash';
import Handlebars from 'handlebars';
import { CONTENT_DIR, COMPONENT_MAPPING_FILE, MAPPING_TEMPLATE, COMPONENTS_DIR } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import writeFile from '../helpers/writeFile';
import getComponentMappings from '../getComponentMappings';
import { BuildConfig, BuildTask } from '../types';

const readdir = promisify(r);

const writeMappingJs = async (mappings: Record<string, string>) => {
  const componentsDir = slash(relative(CONTENT_DIR, COMPONENTS_DIR));
  const out = Handlebars.compile(MAPPING_TEMPLATE)({ mappings, componentsDir });
  await writeFile(COMPONENT_MAPPING_FILE, out);
};

const getAndProcessComponentMappings = async (buildConfig: BuildConfig): Promise<Record<string, string>> => {
  const [componentNames, queryResults] = await Promise.all([readdir(COMPONENTS_DIR), getContentTypes()]);
  return getComponentMappings(componentNames, queryResults.items || [], buildConfig && buildConfig.mappings);
};

const writeMappings: BuildTask = async (buildConfig): Promise<void> => {
  await mkdirIfNotExists(CONTENT_DIR);

  const mappings = await getAndProcessComponentMappings(buildConfig);

  await writeMappingJs(mappings);
};

export default writeMappings;
