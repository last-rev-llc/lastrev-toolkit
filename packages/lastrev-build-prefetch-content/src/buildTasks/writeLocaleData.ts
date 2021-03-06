import { each, get, identity, keyBy, mapValues } from 'lodash';
import { resolve } from 'path';
import { Entry } from 'contentful';
import { BuildConfig, BuildTask, LocalizationLookupType } from '../types';
import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { LocalizationLookupMapping } from '@last-rev/integration-contentful';

const writeI18nJson = async (
  locales: string[],
  defaultLanguage: string,
  currentPagesDir: string,
  finalPagesDir: string,
  localesPath: string,
  i18nFile: string
) => {
  const i18nJson = {
    allLanguages: locales,
    defaultLanguage,
    currentPagesDir: currentPagesDir,
    finalPagesDir: finalPagesDir,
    localesPath: localesPath,
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
    // resolving here instead of earlier in order to write the unresolved version to the i8n file.
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

const assignItem = (obj, entry, locale, defaultLocale) => {
  obj[get(entry, `fields.key['${defaultLocale}']`) as string] = get(
    entry,
    `fields.value[${locale}]`,
    get(entry, `fields.value[${defaultLocale}]`, '')
  );
};

const getLookupMappingFromContent = (
  buildConfig: BuildConfig,
  contentMapping: Record<string, any>,
  contentById: { [id: string]: Entry<any> },
  defaultLocale: string
): Record<string, Record<string, string>> => {
  const itemType = get(buildConfig, 'locales.localizationItemContentTypeId');
  const setType = get(buildConfig, 'locales.localizationSetContentTypeId');

  return mapValues(contentMapping, (entryLinks, locale) => {
    const out = {};
    each(entryLinks, (entryLink) => {
      const entryId = get(entryLink, 'sys.id');
      const entry = contentById[entryId];
      const contentType = get(entry, 'sys.contentType.sys.id');
      if (contentType === itemType) {
        assignItem(out, entry, locale, defaultLocale);
      } else if (contentType === setType) {
        const items = get(entry, `fields.items['${locale}']`, get(entry, `fields.items['${defaultLocale}']`, []));
        each(items, (itemLink) => {
          const itemId = get(itemLink, 'sys.id');
          const entry = contentById[itemId];
          assignItem(out, entry, locale, defaultLocale);
        });
      }
    });
    return out;
  });
};

type LocaleData = { locales: string[]; defaultLocale: string };

const getFinalLookupMapping = (
  buildConfig: BuildConfig,
  localizationLookupMapping: LocalizationLookupMapping,
  contentById: { [id: string]: Entry<any> },
  defaultLocale: string
): Record<string, Record<string, string>> => {
  const lookupType: LocalizationLookupType = get(buildConfig, 'locales.lookupType');

  if (lookupType === 'JSON') return localizationLookupMapping;
  return getLookupMappingFromContent(buildConfig, localizationLookupMapping, contentById, defaultLocale);
};

const writeLocales: BuildTask = async (buildConfig, prefetchedContent): Promise<void> => {
  const settingsId = process.env.CONTENTFUL_SETTINGS_ID;

  if (!settingsId) {
    throw Error(`required environment variable: "CONTENTFUL_SETTINGS_ID" is missing. Please update your environment.`);
  }

  const localizationLookupFieldName = get(buildConfig, 'locales.localizationLookupFieldName');

  const { i18nFile, untranslatedPagesDirectory, translatedPagesDirectory, localesOutputDirectory } = buildConfig;
  const { locales, defaultLocale, contentById } = prefetchedContent;

  const localizationLookupField = get(contentById, `${settingsId}.fields['${localizationLookupFieldName}']`);
  const defaultValue = localizationLookupField[defaultLocale];
  const localizationLookupMapping = mapValues(keyBy(locales, identity), (locale) =>
    get(localizationLookupField, locale, defaultValue)
  );

  const finalMapping = getFinalLookupMapping(buildConfig, localizationLookupMapping, contentById, defaultLocale);

  await Promise.all([
    writeI18nJson(
      locales,
      defaultLocale,
      untranslatedPagesDirectory,
      translatedPagesDirectory,
      localesOutputDirectory,
      i18nFile
    ),
    writeLocaleFiles(finalMapping, localesOutputDirectory)
  ]);
};

export default writeLocales;
