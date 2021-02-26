import writeFile from '../helpers/writeFile';
import getComponentMappings from '../getComponentMappings';
import { BuildTask, MappingConfig, PreloadedContentfulContent } from '../types';

const writeMappingJs = async (mappingFile: string, mappingsJson: string) => {
  await writeFile(mappingFile, `export default ${mappingsJson}`);
};

const writeMappingJson = async (mappingFile: string, mappingsJson: string) => {
  await writeFile(mappingFile, mappingsJson);
};

const writeMappingFile = async (mappingFile: string, mappings: Record<string, string>): Promise<void> => {
  const mappingsJson = JSON.stringify(mappings, null, 2);
  if (mappingFile.endsWith('.json')) {
    writeMappingJson(mappingFile, mappingsJson);
  } else {
    writeMappingJs(mappingFile, mappingsJson);
  }
};

const getAndProcessComponentMappings = async (
  mappings: MappingConfig,
  prefetchedContent: PreloadedContentfulContent
): Promise<Record<string, string>> => {
  const { contentTypes } = prefetchedContent;
  return getComponentMappings(contentTypes, mappings);
};

const writeMappings: BuildTask = async (buildConfig, prefetchedContent): Promise<void> => {
  const { mappingFile, mappings } = buildConfig;

  const componentMappings = await getAndProcessComponentMappings(mappings, prefetchedContent);

  await writeMappingFile(mappingFile, componentMappings);
};

export default writeMappings;
