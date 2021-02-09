import { getContentTypes } from '@last-rev/integration-contentful';
import { promisify } from 'util';
import { readdir as r } from 'fs';
import { relative } from 'path';
import slash from 'slash';
import Handlebars from 'handlebars';
import { MAPPING_TEMPLATE } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import writeFile from '../helpers/writeFile';
import getComponentMappings from '../getComponentMappings';
import { BuildTask, MappingConfig } from '../types';

const readdir = promisify(r);

const writeMappingJs = async (
  outputDir: string,
  componentsDir: string,
  mappingFile: string,
  mappings: Record<string, string>
) => {
  const componentsDirRelative = slash(relative(outputDir, componentsDir));
  const out = Handlebars.compile(MAPPING_TEMPLATE)({ mappings, componentsDir: componentsDirRelative });
  await writeFile(mappingFile, out);
};

const getAndProcessComponentMappings = async (
  mappings: MappingConfig,
  componentsDir: string
): Promise<Record<string, string>> => {
  const [componentNames, queryResults] = await Promise.all([readdir(componentsDir), getContentTypes()]);
  return getComponentMappings(componentNames, queryResults.items || [], mappings);
};

const writeMappings: BuildTask = async (buildConfig): Promise<void> => {
  const { outputDirectory, mappingFile, componentsDirectory, mappings } = buildConfig;

  await mkdirIfNotExists(outputDirectory);

  const componentMappings = await getAndProcessComponentMappings(mappings, componentsDirectory);

  await writeMappingJs(outputDirectory, componentsDirectory, mappingFile, componentMappings);
};

export default writeMappings;
