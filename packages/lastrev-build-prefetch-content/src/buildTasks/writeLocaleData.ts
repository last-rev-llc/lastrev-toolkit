import { getLocalizationLookup, getLocales, LocalizationLookupMapping } from '@last-rev/integration-contentful';
import _ from 'lodash';
import { resolve } from 'path';

import { BuildTask } from '../types';
import writeFile from '../helpers/writeFile';
import {
  CONTENT_DIR,
  I18N_JSON_FILE,
  DEFAULT_RAW_PAGES_DIR,
  PROJECT_ROOT,
  DEFAULT_LOCALES_OUTPUT_PATH
} from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';

const writeI18nJson = async (
  locales: string[],
  defaultLanguage: string,
  currentPagesDir: string,
  localesPath: string,
  useV1: boolean
) => {
  const i18nJson = {
    allLanguages: locales,
    defaultLanguage,
    currentPagesDir,
    finalPagesDir: 'src/pages',
    localesPath,
    pages: {
      '*': ['common']
    }
  };
  const v1I18nJson = {
    locales,
    defaultLocale: defaultLanguage,
    pages: {
      '*': ['common']
    }
  };
  const out = JSON.stringify(useV1 ? v1I18nJson : i18nJson, null, 2);
  await writeFile(I18N_JSON_FILE, out);
};

const writeLocaleFiles = async (
  localizationLookupMapping: LocalizationLookupMapping,
  localesDir: string
): Promise<void> => {
  const mkDirPromises = [];
  const dirMappings = [];

  _.each(localizationLookupMapping, (mapping, localeCode) => {
    const dir = resolve(localesDir, `./${localeCode}`);

    dirMappings.push([dir, mapping]);

    mkDirPromises.push(mkdirIfNotExists(dir));
  });

  await Promise.all(mkDirPromises);

  const writeFilePromises = [];

  _.each(dirMappings, ([dir, mapping]) => {
    const file = resolve(dir, './common.json');
    writeFilePromises.push(writeFile(file, JSON.stringify(mapping, null, 2)));
  });

  await Promise.all(writeFilePromises);
};

const writeLocales: BuildTask = async (buildConfig): Promise<void> => {
  const currentPagesDir = _.has(buildConfig, 'locales.rawPagesDir')
    ? buildConfig.locales.rawPagesDir
    : DEFAULT_RAW_PAGES_DIR;
  const localesPath = _.has(buildConfig, 'locales.outputPath')
    ? buildConfig.locales.outputPath
    : DEFAULT_LOCALES_OUTPUT_PATH;
  const localizationLookupFieldName = _.has(buildConfig, 'locales.localizationLookupFieldName')
    ? buildConfig.locales.localizationLookupFieldName
    : undefined;

  const useV1 = !!buildConfig.locales.useV1;

  const settingsContentType = _.has(buildConfig, 'settingsContentType') ? buildConfig.settingsContentType : undefined;
  const localesDir = resolve(PROJECT_ROOT, `./${localesPath}`);

  await Promise.all([mkdirIfNotExists(CONTENT_DIR), mkdirIfNotExists(localesDir)]);

  const [localizationLookupMapping, locales] = await Promise.all([
    getLocalizationLookup({ localizationLookupFieldName, contentTypeId: settingsContentType }),
    getLocales()
  ]);

  const localeCodes = _.map(locales, 'code');
  const defaultLocale = _.find(locales, (locale) => {
    return locale.default;
  }).code;

  await Promise.all([
    writeI18nJson(localeCodes, defaultLocale, currentPagesDir, localesPath, useV1),
    writeLocaleFiles(localizationLookupMapping, localesDir)
  ]);
};

export default writeLocales;
