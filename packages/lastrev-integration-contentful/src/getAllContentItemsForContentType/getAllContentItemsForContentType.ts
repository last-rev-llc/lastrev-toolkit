import { ContentfulClientApi, Entry } from 'contentful';
import { map } from 'lodash';
import { DEFAULT_ORDER_PARAM, DEFAULT_LOCALE_PARAM } from '../constants';
import removeCircularRefs from '../helpers/removeCircularRefs';

const getAllContentItemsForContentTypeCreator = (client: ContentfulClientApi) => async <T>({
  contentTypeId,
  fields = [],
  order = DEFAULT_ORDER_PARAM,
  include = 1,
  paginate = false,
  locale = DEFAULT_LOCALE_PARAM,
  skip = 0,
  limit = 1000
}: {
  contentTypeId: string;
  fields?: string[];
  order?: string;
  locale?: string;
  include?: number;
  paginate?: boolean;
  skip?: number;
  limit?: number;
}): Promise<Entry<T>[]> => {
  const select = fields.length
    ? map(fields, (field) => {
        return `sys.contentType,fields.${field}`;
      }).join(',')
    : null;

  if (paginate) {
    const queryResults = await client.getEntries<T>({
      content_type: contentTypeId,
      select,
      order,
      locale,
      limit,
      skip,
      include
    });

    const { items } = removeCircularRefs(queryResults);
    return items;
  }
  const entries: Entry<T>[] = [];

  let total;
  let items: Entry<T>[] = [];
  let count = 0;
  while (total === undefined || total > count) {
    // eslint-disable-next-line no-await-in-loop
    const queryResults = await client.getEntries<T>({
      content_type: contentTypeId,
      select,
      order,
      locale,
      limit,
      skip,
      include
    });

    // eslint-disable-next-line no-param-reassign
    ({ skip, limit, total } = queryResults);
    ({ items } = removeCircularRefs(queryResults));

    count += items.length;
    // eslint-disable-next-line no-param-reassign
    skip += items.length;

    entries.push(...items);
  }
  return entries;
};

export default getAllContentItemsForContentTypeCreator;
