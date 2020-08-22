import { ContentfulClientApi, Entry } from 'contentful';
import { map } from 'lodash';
import { DEFAULT_ORDER_PARAM } from '../constants';
import removeCircularRefs from '../helpers/removeCircularRefs';

const getStaticSlugsForContentTypeCreator = (client: ContentfulClientApi) => async <T>({
  contentTypeId,
  fields = [],
  order = DEFAULT_ORDER_PARAM,
  nestedFieldName,
  include = 1
}: {
  contentTypeId: string;
  fields?: string[];
  order?: string;
  nestedFieldName?: string;
  include?: number;
}): Promise<Entry<T>[]> => {
  const entries: Entry<T>[] = [];

  let skip = 0;
  let limit = 1000;
  let total;
  let items: Entry<T>[] = [];
  let count = 0;

  // eslint-disable-next-line no-param-reassign
  if (include === 1 && nestedFieldName) include = 2;

  const select = fields.length
    ? map(fields, (field) => {
        return `fields.${field}`;
      }).join(', ')
    : null;

  while (total === undefined || total > count) {
    // eslint-disable-next-line no-await-in-loop
    const queryResults = await client.getEntries<T>({
      content_type: contentTypeId,
      select,
      order,
      limit,
      skip,
      include
    });

    ({ skip, limit, total } = queryResults);
    ({ items } = removeCircularRefs(queryResults));

    count += items.length;
    skip += count;

    entries.push(...items);
  }

  return entries;
};

export default getStaticSlugsForContentTypeCreator;
