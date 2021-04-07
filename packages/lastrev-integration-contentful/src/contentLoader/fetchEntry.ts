import removeCircularRefs from '../helpers/removeCircularRefs';
import { head } from 'lodash';

const fetchEntry = ({ client }) => async ({ contentTypeId, id, slug, locale, include = 2 }) => {
  console.log('fetchEntry', { id, slug, contentTypeId, locale });
  let entry;
  if (id) {
    console.log('getEntry');
    entry = await client.getEntry(id, { include, locale });
  } else if (slug) {
    console.log('GetEntries', { 'content_type': contentTypeId, 'fields.slug': slug, include, locale });
    const entries = await client.getEntries({
      'content_type': contentTypeId,
      'fields.slug': slug,
      include,
      locale
    });
    entry = head(removeCircularRefs(entries).items);
  }
  console.log('fetchEntry:Entry', { entry, locale });
  return {
    ...entry,
    fields: {
      ...entry.fields,
      locale
    }
  };
};

export default fetchEntry;
