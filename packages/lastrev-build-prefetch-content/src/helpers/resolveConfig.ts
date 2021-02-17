import { resolve } from 'path';
import { get, chain, identity } from 'lodash';

import {
  BuildConfig,
  ResolvedBuildConfig,
  SwitchesBuildConfig,
  FileLocationsBuildConfig,
  LocalesConfig
} from '../types';
import {
  PROJECT_ROOT,
  DEFAULT_OUTPUT_DIRNAME,
  DEFAULT_ADAPTER_CONFIG_FILENAME,
  DEFAULT_COMPONENTS_DIRNAME,
  DEFAULT_CONTENT_JSON_DIRNAME,
  DEFAULT_I18N_FILENAME,
  DEFAULT_MAPPING_FILENAME,
  DEFAULT_PATHS_FILENAME,
  DEFAULT_SETTINGS_FILENAME,
  DEFAULT_UNTRANSLATED_PAGES_DIRNAME,
  DEFAULT_LOCALES_OUTPUT_DIRNAME,
  DEFAULT_TRANSLATED_PAGES_DIRNAME,
  DEFAULT_LOCALES_LOOKUP_TYPE,
  DEFAULT_LOCALIZATION_LOOKUP_FIELD_NAME,
  DEFAULT_LOCALIZATION_ITEM_CONTENT_TYPE,
  DEFAULT_LOCALIZATION_SET_CONTENT_TYPE
} from '../constants';

const resolveSwitches = (buildConfig: BuildConfig): SwitchesBuildConfig => {
  return chain([
    'useAdapter',
    'useWebsiteSectionPaths',
    'writeSettings',
    'writePaths',
    'writeMappings',
    'writeAdapterConfig',
    'writeLocaleData',
    'writeContentJson'
  ])
    .keyBy(identity)
    .mapValues((val) => get(buildConfig, val, false))
    .value() as SwitchesBuildConfig;
};

const resolveFileLocations = (buildConfig: BuildConfig): FileLocationsBuildConfig => {
  const outputDirectory = resolve(PROJECT_ROOT, get(buildConfig, 'outputDirectory', DEFAULT_OUTPUT_DIRNAME));

  const resolveToOutputDir = (key: string, defaultVal: string): string =>
    resolve(outputDirectory, get(buildConfig, key, defaultVal));
  const resolveToProjectRoot = (key: string, defaultVal: string): string =>
    resolve(PROJECT_ROOT, get(buildConfig, key, defaultVal));
  const resolveToProjectRootWithLegacyField = (key: string, legacyKey: string, defaultVal: string): string =>
    resolve(PROJECT_ROOT, get(buildConfig, key, get(buildConfig, legacyKey, defaultVal)));

  const adapterConfigFile = resolveToOutputDir('adapterConfigFile', DEFAULT_ADAPTER_CONFIG_FILENAME);
  const contentJsonDirectory = resolveToOutputDir('contentJsonDirectory', DEFAULT_CONTENT_JSON_DIRNAME);
  const mappingFile = resolveToOutputDir('mappingFile', DEFAULT_MAPPING_FILENAME);
  const pathsFile = resolveToOutputDir('pathsFile', DEFAULT_PATHS_FILENAME);
  const settingsFile = resolveToOutputDir('settingsFile', DEFAULT_SETTINGS_FILENAME);

  const i18nFile = resolveToProjectRoot('i18nFile', DEFAULT_I18N_FILENAME);
  const componentsDirectory = resolveToProjectRoot('componentsDirectory', DEFAULT_COMPONENTS_DIRNAME);
  const translatedPagesDirectory = resolveToProjectRoot('translatedPagesDirectory', DEFAULT_TRANSLATED_PAGES_DIRNAME);
  const untranslatedPagesDirectory = resolveToProjectRootWithLegacyField(
    'untranslatedPagesDirectory',
    'locales.rawPagesDir',
    DEFAULT_UNTRANSLATED_PAGES_DIRNAME
  );
  const localesOutputDirectory = resolveToProjectRootWithLegacyField(
    'localesOutputDirectory',
    'locales.outputPath',
    DEFAULT_LOCALES_OUTPUT_DIRNAME
  );

  return {
    outputDirectory,
    adapterConfigFile,
    contentJsonDirectory,
    mappingFile,
    pathsFile,
    settingsFile,
    i18nFile,
    componentsDirectory,
    translatedPagesDirectory,
    untranslatedPagesDirectory,
    localesOutputDirectory
  };
};

const resolveLocalesConfigValues = (buildConfig: BuildConfig): LocalesConfig => {
  return {
    ...buildConfig.locales,
    lookupType: get(buildConfig, 'locales.lookupType', DEFAULT_LOCALES_LOOKUP_TYPE),
    localizationLookupFieldName: get(
      buildConfig,
      'locales.localizationLookupFieldName',
      DEFAULT_LOCALIZATION_LOOKUP_FIELD_NAME
    ),
    localizationItemContentTypeId: get(
      buildConfig,
      'locales.localizationItemContentTypeId',
      DEFAULT_LOCALIZATION_ITEM_CONTENT_TYPE
    ),
    localizationSetContentTypeId: get(
      buildConfig,
      'locales.localizationSetContentTypeId',
      DEFAULT_LOCALIZATION_SET_CONTENT_TYPE
    )
  };
};

export default (buildConfig: BuildConfig): ResolvedBuildConfig => {
  const switches = resolveSwitches(buildConfig);
  const fileLocations = resolveFileLocations(buildConfig);
  const locales = resolveLocalesConfigValues(buildConfig);

  return {
    ...buildConfig,
    ...switches,
    ...fileLocations,
    locales
  };
};
