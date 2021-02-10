import { getLocalizationLookup, getLocales, LocalizationLookupMapping } from '@last-rev/integration-contentful';
import { each, find, get, map } from 'lodash';
import { resolve } from 'path';

import { BuildTask } from '../types';
import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';

const writeI18nJson = async (
  locales: string[],
  defaultLanguage: string,
  currentPagesDir: string,
  localesPath: string,
  useV1: boolean,
  i18nFile: string
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
  await writeFile(i18nFile, out);
};

const writeLocaleFiles = async (
  localizationLookupMapping: LocalizationLookupMapping,
  localesDir: string
): Promise<void> => {
  const mkDirPromises = [];
  const dirMappings = [];

  each(localizationLookupMapping, (mapping, localeCode) => {
    const dir = resolve(localesDir, `./${localeCode}`);

    dirMappings.push([dir, mapping]);

    mkDirPromises.push(mkdirIfNotExists(dir));
  });

  await Promise.all(mkDirPromises);

  const writeFilePromises = [];

  each(dirMappings, ([dir, mapping]) => {
    const file = resolve(dir, './common.json');
    writeFilePromises.push(writeFile(file, JSON.stringify(mapping, null, 2)));
  });

  await Promise.all(writeFilePromises);
};

const writeLocales: BuildTask = async (buildConfig): Promise<void> => {
  const localizationLookupFieldName = get(buildConfig, 'locales.localizationLookupFieldName');

  const useV1 = !!buildConfig.locales.useV1;

  const { settingsContentType, i18nFile, untranslatedPagesDirectory, localesOutputDirectory } = buildConfig;

  const [localizationLookupMapping, locales] = await Promise.all([
    getLocalizationLookup({ localizationLookupFieldName, contentTypeId: settingsContentType }),
    getLocales()
  ]);

  const localeCodes = map(locales, 'code');
  const defaultLocale = find(locales, (locale) => {
    return locale.default;
  }).code;

  await Promise.all([
    writeI18nJson(localeCodes, defaultLocale, untranslatedPagesDirectory, localesOutputDirectory, useV1, i18nFile),
    writeLocaleFiles(localizationLookupMapping, localesOutputDirectory)
  ]);
};

export default writeLocales;
