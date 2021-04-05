import writeSettings from './writeSettings';
import writePaths from './writePaths';
import writeMappings from './writeMappings';
import writeAdapterConfig from './writeAdapterConfig';
import writeLocaleData from './writeLocaleData';
import { BuildTask, ResolvedBuildConfig } from '../types';
import writeContentJson from './writeContentJson';
import writeNestedPaths from './writeNestedPaths';
import assertEnvVar from '../helpers/assertEnvVar';

const getBuildTasks = (buildConfig: ResolvedBuildConfig): BuildTask[] => {
  const out: BuildTask[] = [];

  if (buildConfig.writeSettings) {
    assertEnvVar('CONTENTFUL_SETTINGS_ID');
    out.push(writeSettings);
  }
  if (buildConfig.writePaths) {
    switch (buildConfig.paths.type) {
      case 'Nested Parent':
        out.push(writeNestedPaths);
        break;
      case 'Nested Children':
        out.push(writePaths);
        break;
      default:
    }
  }

  if (buildConfig.writeMappings) out.push(writeMappings);
  if (buildConfig.writeAdapterConfig) out.push(writeAdapterConfig);
  if (buildConfig.writeLocaleData) {
    assertEnvVar('CONTENTFUL_SETTINGS_ID');
    out.push(writeLocaleData);
  }
  if (buildConfig.writeContentJson) out.push(writeContentJson);

  return out;
};

export default getBuildTasks;
