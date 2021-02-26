import writeFile from '../helpers/writeFile';
import { BuildTask } from '../types';

const writePathsFile = async (pathsFile: string, pathsObject) => {
  const jsonOutput = JSON.stringify(pathsObject, null, 2);

  // if outputfile has js extension, write it as a js module, else write it as plain json;
  const out = pathsFile.endsWith('.js') ? `export default ${jsonOutput};` : jsonOutput;

  await writeFile(pathsFile, out);
};

const writeNestedPaths: BuildTask = async (buildConfig, prefetchedContent): Promise<void> => {
  const { pathsByContentType } = prefetchedContent;

  writePathsFile(buildConfig.pathsFile, pathsByContentType);
};

export default writeNestedPaths;
