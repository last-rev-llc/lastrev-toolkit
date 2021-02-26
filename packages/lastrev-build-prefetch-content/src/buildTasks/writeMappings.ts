import { promises } from 'fs';
import { relative } from 'path';
import slash from 'slash';
import Handlebars from 'handlebars';
import { MAPPING_TEMPLATE } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import writeFile from '../helpers/writeFile';
import getComponentMappings from '../getComponentMappings';
import { BuildTask, MappingConfig, PreloadedContentfulContent } from '../types';

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
  componentsDir: string,
  prefetchedContent: PreloadedContentfulContent
): Promise<Record<string, string>> => {
  const componentNames = await promises.readdir(componentsDir);
  const { contentTypes } = prefetchedContent;
  return getComponentMappings(componentNames, contentTypes, mappings);
};

const writeMappings: BuildTask = async (buildConfig, prefetchedContent): Promise<void> => {
  const { outputDirectory, mappingFile, componentsDirectory, mappings } = buildConfig;

  await mkdirIfNotExists(outputDirectory);

  const componentMappings = await getAndProcessComponentMappings(mappings, componentsDirectory, prefetchedContent);

  await writeMappingJs(outputDirectory, componentsDirectory, mappingFile, componentMappings);
};

export default writeMappings;
