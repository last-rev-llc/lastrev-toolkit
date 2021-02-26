import { each, get, identity, keyBy, mapValues } from 'lodash';
import { resolve } from 'path';

import { BuildConfig, BuildTask, LocalizationLookupType } from '../types';
import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { LocalizationLookupMapping } from '@last-rev/integration-contentful';

const writeI18nJson = async (
  locales: string[],
  defaultLanguage: string,
  currentPagesDir: string,
  localesPath: string,
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
  const out = JSON.stringify(i18nJson, null, 2);
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

const assignItem = (obj, entry) => {
  obj[get(entry, 'fields.key') as string] = get(entry, 'fields.value');
};

const getLookupMappingFromContent = (
  buildConfig: BuildConfig,
  contentMapping: Record<string, any>
): Record<string, Record<string, string>> => {
  const itemType = get(buildConfig, 'locales.localizationItemContentTypeId');
  const setType = get(buildConfig, 'locales.localizationSetContentTypeId');

  return mapValues(contentMapping, (entries) => {
    const out = {};
    each(entries, (entry) => {
      const contentType = get(entry, 'sys.contentType.sys.id');
      if (contentType === itemType) {
        assignItem(out, entry);
      } else if (contentType === setType) {
        each(get(entry, 'fields.items'), (item) => {
          assignItem(out, item);
        });
      }
    });
    return out;
  });
};

type LocaleData = { locales: string[]; defaultLocale: string };

const getFinalLookupMapping = (
  buildConfig: BuildConfig,
  localizationLookupMapping: LocalizationLookupMapping
): Record<string, Record<string, string>> => {
  const lookupType: LocalizationLookupType = get(buildConfig, 'locales.lookupType');

  if (lookupType === 'JSON') return localizationLookupMapping;
  return getLookupMappingFromContent(buildConfig, localizationLookupMapping);
};

const writeLocales: BuildTask = async (buildConfig, prefetchedContent): Promise<void> => {
  const localizationLookupFieldName = get(buildConfig, 'locales.localizationLookupFieldName');

  const { i18nFile, untranslatedPagesDirectory, localesOutputDirectory } = buildConfig;
  const { locales, defaultLocale, contentById } = prefetchedContent;

  const localizationLookupField = get(
    contentById,
    `${process.env.CONTENTFUL_SETTINGS_ID}.fields['${localizationLookupFieldName}']`
  );
  const defaultValue = localizationLookupField[defaultLocale];
  const localizationLookupMapping = mapValues(keyBy(locales, identity), (locale) =>
    get(localizationLookupField, locale, defaultValue)
  );

  await Promise.all([
    writeI18nJson(locales, defaultLocale, untranslatedPagesDirectory, localesOutputDirectory, i18nFile),
    writeLocaleFiles(getFinalLookupMapping(buildConfig, localizationLookupMapping), localesOutputDirectory)
  ]);
};

export default writeLocales;
