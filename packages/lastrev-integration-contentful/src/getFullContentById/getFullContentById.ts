import _ from 'lodash';
import { ContentfulClientApi, Entry } from 'contentful';
import { GetFullContentByIdConfig } from '../types';
import removeCircularRefs from '../helpers/removeCircularRefs';

const getFullContentByIdCreator = (client: ContentfulClientApi) => async <T>({
  contentTypeId,
  id,
  locale,
  include,
  omitFields = []
}: GetFullContentByIdConfig): Promise<Entry<T>> => {
  const entries = await client.getEntries({
    'content_type': contentTypeId,
    'sys.id': id,
    'include': include,
    'locale': locale
  });

  return _.head(removeCircularRefs(entries, omitFields).items) as Entry<T>;
};

export default getFullContentByIdCreator;
