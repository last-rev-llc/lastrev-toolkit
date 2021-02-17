import { DEFAULT_LOCALIZATION_LOOKUP_FIELD_NAME, DEFAULT_SETTINGS_CONTENT_TYPE } from '../constants';
import { LocalizationLookupMapping } from '../types';

const getLocalizationLookup = (client) => async ({
  localizationLookupFieldName = DEFAULT_LOCALIZATION_LOOKUP_FIELD_NAME,
  contentTypeId = DEFAULT_SETTINGS_CONTENT_TYPE
}: {
  localizationLookupFieldName?: string;
  contentTypeId?: string;
}): Promise<LocalizationLookupMapping> => {
  const locales = await client.getLocales();
  const localeCodes = locales.items.map((locale) => locale.code);
  const commonTextQueries = [];

  for (let index = 0; index < localeCodes.length; index++) {
    const code = localeCodes[index];
    commonTextQueries.push(
      client.getEntries({
        'content_type': contentTypeId,
        'select': `sys,fields.${localizationLookupFieldName}`,
        'sys.id': process.env.CONTENTFUL_SETTINGS_ID,
        'locale': code,
        'include': 2
      })
    );
  }

  const queryResults = await Promise.all(commonTextQueries);
  const fullLocaleLookup = {};

  for (let index = 0; index < queryResults.length; index++) {
    const result = queryResults[index];
    if (result.items && result.items.length > 0) {
      const l18nLookup = result.items[0].fields[localizationLookupFieldName];
      const { locale } = result.items[0].sys;
      fullLocaleLookup[locale] = l18nLookup;
    }
  }

  return fullLocaleLookup;
};

export default getLocalizationLookup;
