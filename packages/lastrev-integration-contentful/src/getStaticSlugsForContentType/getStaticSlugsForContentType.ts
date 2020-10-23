import { ContentfulClientApi, Entry } from 'contentful';
import _ from 'lodash';
import { DEFAULT_SLUG_FIELD_NAME, DEFAULT_ORDER_PARAM } from '../constants';
import { StaticSlugResult } from '../types';

const getStaticSlugsForContentTypeCreator = (client: ContentfulClientApi) => async ({
  contentTypeId,
  slugFieldName = DEFAULT_SLUG_FIELD_NAME,
  order = DEFAULT_ORDER_PARAM,
  nestedFieldName,
  include = 1
}: {
  contentTypeId: string;
  slugFieldName?: string;
  order?: string;
  nestedFieldName?: string;
  include?: number;
}): Promise<StaticSlugResult[]> => {
  const slugs: StaticSlugResult[] = [];

  let skip = 0;
  let limit = 1000;
  let total;
  let items: Entry<unknown>[] = [];
  let count = 0;

  // eslint-disable-next-line no-param-reassign
  if (include === 1 && nestedFieldName) include = 2;

  const select = `fields.${slugFieldName}${nestedFieldName ? `,fields.${nestedFieldName}` : ''}`;

  while (total === undefined || total > count) {
    // eslint-disable-next-line no-await-in-loop
    const queryResults = await client.getEntries({
      content_type: contentTypeId,
      select,
      order,
      limit,
      skip,
      include
    });

    ({ skip, limit, total, items } = queryResults);

    count += items.length;
    skip += items.length;

    items.forEach((item) => {
      if (nestedFieldName) {
        if (_.has(item.fields, slugFieldName) && _.has(item.fields, nestedFieldName)) {
          const slug = _.get(item.fields, slugFieldName) as string;
          const nested = _.get(item.fields, nestedFieldName) as Entry<unknown>[];
          const out: StaticSlugResult = [slug, nested];
          slugs.push(out);
        }
      } else if (_.has(item.fields, slugFieldName)) {
        slugs.push(_.get(item.fields, slugFieldName));
      }
    });
  }

  return slugs;
};

export default getStaticSlugsForContentTypeCreator;
