import { AdapterConfig } from '@last-rev/adapter-contentful';

import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { CONTENT_DIR, ADAPTER_CONFIG_FILE } from '../constants';
import { BuildTask } from '../types';

const writeAdapterConfigJs = async (adapterConfig: AdapterConfig) => {
  const out = `export default ${JSON.stringify(adapterConfig, null, 2)};`;
  await writeFile(ADAPTER_CONFIG_FILE, out);
};

const writeAdapterConfig: BuildTask = async (_, { adapterConfig }: { adapterConfig: AdapterConfig }): Promise<void> => {
  await mkdirIfNotExists(CONTENT_DIR);
  await writeAdapterConfigJs(adapterConfig);
};

export default writeAdapterConfig;
