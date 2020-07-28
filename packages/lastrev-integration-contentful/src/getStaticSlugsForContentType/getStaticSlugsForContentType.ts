import { ContentfulClientApi } from 'contentful';
import _ from 'lodash';
import { DEFAULT_SLUG_FIELD_NAME, DEFAULT_ORDER_PARAM } from '../constants';

const getStaticSlugsForContentTypeCreator = (client: ContentfulClientApi) => async ({
  contentTypeId,
  slugFieldName = DEFAULT_SLUG_FIELD_NAME,
  order = DEFAULT_ORDER_PARAM
}: {
  contentTypeId: string;
  slugFieldName?: string;
  order?: string;
}): Promise<string[]> => {
  const slugs = [];

  let skip = 0;
  let limit = 1000;
  let total;
  let items = [];
  let count = 0;

  while (!total || total > count) {
    const queryResults = await client.getEntries({
      content_type: contentTypeId,
      select: `fields.${slugFieldName}`,
      order,
      limit,
      skip
    });

    ({ skip, limit, total, items } = queryResults);

    count += items.length;
    skip += count;

    items.forEach((item) => {
      if (_.has(item.fields, slugFieldName)) {
        slugs.push(_.get(item.fields, slugFieldName));
      }
    });
  }

  return slugs;
};

export default getStaticSlugsForContentTypeCreator;
