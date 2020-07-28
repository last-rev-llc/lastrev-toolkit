import _ from 'lodash';
import { ContentfulClientApi, Entry } from 'contentful';
import { GetFullContentByIdConfig } from '../types';

const getFullContentByIdCreator = (client: ContentfulClientApi) => async <T>({
  contentTypeId,
  id,
  locale,
  include
}: GetFullContentByIdConfig): Promise<Entry<T>> => {
  const { items } = await client.getEntries({
    'content_type': contentTypeId,
    'sys.id': id,
    'include': include,
    'locale': locale
  });

  return _.head(items) as Entry<T>;
};

export default getFullContentByIdCreator;
