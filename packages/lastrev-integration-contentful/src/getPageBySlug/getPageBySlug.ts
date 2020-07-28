import _ from 'lodash';
import { DEFAULT_SLUG_FIELD_NAME } from '../constants';
import removeCircularRefs from '../helpers/removeCircularRefs';
import { ContentfulClientApi, Entry } from 'contentful';
import { GetPageBySlugConfig } from '../types';

const getPageBySlugCreator = (client: ContentfulClientApi) => async <T>({
  slug,
  contentTypeId,
  locale,
  include = 4,
  slugFieldName = DEFAULT_SLUG_FIELD_NAME
}: GetPageBySlugConfig): Promise<Entry<T>> => {
  const opts = {
    content_type: contentTypeId,
    include,
    locale
  };

  opts[`fields.${slugFieldName}`] = slug;

  const entries = await client.getEntries(opts);
  return _.head(removeCircularRefs(entries).items) as Entry<T>;
};

export default getPageBySlugCreator;
