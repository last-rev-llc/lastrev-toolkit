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
  const entries = await client.getEntries({
    'content_type': contentTypeId,
    'sys.id': process.env.CONTENTFUL_SETTINGS_ID,
    'locale': locale,
    'include': include
  });
  return _.head(removeCircularRefs(entries).items) as Entry<T>;
};

export default getGlobalSettings;
