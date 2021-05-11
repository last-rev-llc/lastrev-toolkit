import { ContentfulClientApi, Entry } from 'contentful';
import removeCircularRefs from '../helpers/removeCircularRefs';
import { GetEntriesConfig, getEntriesResult } from '../types';

const getEntries = (client: ContentfulClientApi) => async <T>({
  query,
  paginate = false,
  skip = 0,
  limit = 1000,
  omitFields = []
}: GetEntriesConfig): Promise<getEntriesResult> => {
  if (paginate) {
    const queryResults = await client.getEntries<T>({
      ...query,
      limit,
      skip
    });

    const { items, total } = removeCircularRefs(queryResults, omitFields);
    return { total, items };
  }
  const entries: Entry<any>[] = [];

  let total;
  let items: Entry<any>[] = [];
  let count = 0;
  while (total === undefined || total > count) {
    // eslint-disable-next-line no-await-in-loop
    const queryResults = await client.getEntries<T>({
      ...query,
      limit,
      skip
    });

    // eslint-disable-next-line no-param-reassign
    ({ skip, limit, total } = queryResults);
    ({ items } = removeCircularRefs(queryResults, omitFields));

    count += items.length;
    // eslint-disable-next-line no-param-reassign
    skip += items.length;

    entries.push(...items);
  }
  return {
    total,
    items: entries
  };
};

export default getEntries;
