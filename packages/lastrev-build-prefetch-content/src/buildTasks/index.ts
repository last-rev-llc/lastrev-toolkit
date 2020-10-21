import writeSettings from './writeSettings';
import writePaths from './writePaths';
import writeMappings from './writeMappings';
import writeAdapterConfig from './writeAdapterConfig';
import writeLocaleData from './writeLocaleData';
import writeRedirects from './writeRedirects';
import { BuildTask, BuildConfig } from '../types';

const getBuildTasks = (buildConfig: BuildConfig): BuildTask[] => {
  const out: BuildTask[] = [];

  if (buildConfig.writeSettings) out.push(writeSettings);
  if (buildConfig.writePaths) out.push(writePaths);
  if (buildConfig.writeMappings) out.push(writeMappings);
  if (buildConfig.writeAdapterConfig) out.push(writeAdapterConfig);
  if (buildConfig.writeLocaleData) out.push(writeLocaleData);
  if (buildConfig.writeRedirects) out.push(writeRedirects);
  return out;
};

export default getBuildTasks;
