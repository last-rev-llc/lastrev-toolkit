import { resolve } from 'path';
import { get, chain, identity, mapValues, map } from 'lodash';

import {
  BuildConfig,
  ResolvedBuildConfig,
  SwitchesBuildConfig,
  FileLocationsBuildConfig,
  LocalesConfig,
  PathsConfig,
  NestedParentPathsConfig,
  SettingsConfig,
  ContentJsonConfig,
  ExcludePagesConfig
} from '../types';
import {
  PROJECT_ROOT,
  DEFAULT_OUTPUT_DIRNAME,
  DEFAULT_ADAPTER_CONFIG_FILENAME,
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
  DEFAULT_LOCALIZATION_SET_CONTENT_TYPE,
  DEFAULT_NESTED_PATHS_MAX_DEPTH,
  DEFAULT_SLUG_FIELD
} from '../constants';

const resolveSwitches = (buildConfig: BuildConfig): SwitchesBuildConfig => {
  return chain([
    'useAdapter',
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

  const i18nFile = get(buildConfig, 'i18nFile', DEFAULT_I18N_FILENAME);
  const translatedPagesDirectory = resolveToProjectRoot('translatedPagesDirectory', DEFAULT_TRANSLATED_PAGES_DIRNAME);
  const untranslatedPagesDirectory = resolveToProjectRootWithLegacyField(
    'untranslatedPagesDirectory',
    'locales.rawPagesDir',
    DEFAULT_UNTRANSLATED_PAGES_DIRNAME
  );

  const localesOutputDirectory = get(buildConfig, 'localesOutputDirectory', DEFAULT_LOCALES_OUTPUT_DIRNAME);

  return {
    outputDirectory,
    adapterConfigFile,
    contentJsonDirectory,
    mappingFile,
    pathsFile,
    settingsFile,
    i18nFile,
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

const resolvePathConfigValues = (buildConfig: BuildConfig) => {
  const type: PathsConfig['type'] = get(buildConfig, 'paths.type', 'Nested Children');

  let config: PathsConfig['config'] = get(buildConfig, 'paths.config', {});

  switch (type) {
    case 'Nested Parent':
      if (config) {
        config = mapValues(config as NestedParentPathsConfig, (config) => {
          const maxDepth = config.maxDepth || DEFAULT_NESTED_PATHS_MAX_DEPTH;
          return {
            ...config,
            maxDepth,
            paramName: config.paramName || 'slug',
            root: config.root || '/'
          };
        });
      }
      break;
    case 'Website Sections':
      if (!config.pageContentTypes) {
        config.pageContentTypes = [];
      }
      break;
    default:
      break;
  }

  return {
    type,
    config
  };
};

const resolveMappingsConfigValues = (buildConfig: BuildConfig) => {
  const overrides = get(buildConfig, 'mappings.overrides', {});
  const excludes = get(buildConfig, 'mappings.excludes', {});
  return {
    overrides,
    excludes
  };
};

const resolveContentJsonConfigValues = (buildConfig: BuildConfig): ContentJsonConfig => {
  const { contentJson } = buildConfig;
  if (!contentJson) return {};
  return mapValues(contentJson, ({ include, slugField, rootOmitFields, childOmitFields }) => ({
    include,
    slugField: slugField || DEFAULT_SLUG_FIELD,
    rootOmitFields: rootOmitFields || [],
    childOmitFields: childOmitFields || []
  }));
};

const resolveExcludePagesConfigValues = (buildConfig: BuildConfig): ExcludePagesConfig => {
  return buildConfig.excludePages || {};
};

export default (buildConfig: BuildConfig): ResolvedBuildConfig => {
  const switches = resolveSwitches(buildConfig);
  const fileLocations = resolveFileLocations(buildConfig);
  const locales = resolveLocalesConfigValues(buildConfig);
  const paths = resolvePathConfigValues(buildConfig);
  const excludeTypes = get(buildConfig, 'excludeTypes', []) as string[];
  const mappings = resolveMappingsConfigValues(buildConfig);
  const settings = get(buildConfig, 'settings', { include: 5 }) as SettingsConfig;
  const contentJson = resolveContentJsonConfigValues(buildConfig);
  const excludePages = resolveExcludePagesConfigValues(buildConfig);

  return {
    ...switches,
    ...fileLocations,
    excludeTypes,
    mappings,
    paths,
    contentJson,
    settings,
    locales,
    excludePages
  };
};
