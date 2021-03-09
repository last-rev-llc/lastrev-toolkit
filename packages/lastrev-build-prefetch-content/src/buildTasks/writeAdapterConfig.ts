import { AdapterConfig } from '@last-rev/adapter-contentful';
import writeFile from '../helpers/writeFile';
import { BuildTask } from '../types';

const writeAdapterConfigJs = async (adapterConfigFile: string, adapterConfig: AdapterConfig) => {
  const out = `export default ${JSON.stringify(adapterConfig, null, 2)};`;
  await writeFile(adapterConfigFile, out);
};

const writeAdapterConfig: BuildTask = async (
  buildConfig,
  prefetchedContent,
  { adapterConfig }: { adapterConfig: AdapterConfig }
): Promise<void> => {
  const { adapterConfigFile } = buildConfig;
  const { contentUrlLookup } = prefetchedContent;
  await writeAdapterConfigJs(adapterConfigFile, { ...adapterConfig, contentUrlLookup });
};

export default writeAdapterConfig;
