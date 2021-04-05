import { ContentfulClientApi, Entry } from 'contentful';
import _ from 'lodash';
import { DEFAULT_SETTINGS_CONTENT_TYPE } from '../constants';
import removeCircularRefs from '../helpers/removeCircularRefs';
import { GetGlobalSettingsConfig } from '../types';

const getGlobalSettings = (client: ContentfulClientApi) => async <T>({
  locale,
  include = 6,
  contentTypeId = DEFAULT_SETTINGS_CONTENT_TYPE
}: GetGlobalSettingsConfig): Promise<Entry<T>> => {
  const settingsId = process.env.CONTENTFUL_SETTINGS_ID;

  if (!settingsId) {
    throw Error(`required environment variable: "CONTENTFUL_SETTINGS_ID" is missing. Please update your environment.`);
  }

  const entries = await client.getEntries({
    'content_type': contentTypeId,
    'sys.id': settingsId,
    'locale': locale,
    'include': include
  });
  return _.head(removeCircularRefs(entries).items) as Entry<T>;
};

export default getGlobalSettings;
