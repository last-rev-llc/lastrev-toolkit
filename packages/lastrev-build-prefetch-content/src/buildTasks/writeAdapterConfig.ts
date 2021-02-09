import { AdapterConfig } from '@last-rev/adapter-contentful';
import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildTask } from '../types';

const writeAdapterConfigJs = async (adapterConfigFile: string, adapterConfig: AdapterConfig) => {
  const out = `export default ${JSON.stringify(adapterConfig, null, 2)};`;
  await writeFile(adapterConfigFile, out);
};

const writeAdapterConfig: BuildTask = async (
  buildConfig,
  { adapterConfig }: { adapterConfig: AdapterConfig }
): Promise<void> => {
  const { outputDirectory, adapterConfigFile } = buildConfig;
  await mkdirIfNotExists(outputDirectory);
  await writeAdapterConfigJs(adapterConfigFile, adapterConfig);
};

export default writeAdapterConfig;
