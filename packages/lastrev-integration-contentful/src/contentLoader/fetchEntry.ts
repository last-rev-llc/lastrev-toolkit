import removeCircularRefs from '../helpers/removeCircularRefs';
import { head } from 'lodash';

const fetchEntry = ({ client }) => async ({ contentTypeId, id, slug, locale, include = 2 }) => {
  let entry;
  if (id) {
    entry = await client.getEntry(id, { include, locale });
  } else if (slug) {
    const entries = await client.getEntries({
      'content_type': contentTypeId,
      'fields.slug': slug,
      include,
      locale
    });
    entry = head(removeCircularRefs(entries).items);
  }
  return {
    ...entry,
    fields: {
      ...entry.fields,
      locale
    }
  };
};

export default fetchEntry;
