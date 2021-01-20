import { EntryCollection } from 'contentful';
import { omitDeep } from 'deepdash/standalone';

const omitOptions = { checkCircular: false, keepCircular: false, onMatch: { skipChildren: true } };

const removeCircularRefs = <T>(entries: EntryCollection<T>, omitFields?: string[]): EntryCollection<T> => {
  if (omitFields && omitFields.length && entries.includes) {
    if (entries.includes.Entry) {
      entries.includes.Entry = entries.includes.Entry.map((entry) => {
        entries.includes.Entry.fields = omitDeep(entry.fields, new RegExp(omitFields.join('|'), 'i'), omitOptions);
      });
    }

    if (entries.includes.Asset) {
      entries.includes.Asset = entries.includes.Asset.map((asset) => {
        entries.includes.Asset.fields = omitDeep(asset.fields, new RegExp(omitFields.join('|'), 'i'), omitOptions);
      });
    }
  }

  return JSON.parse(entries.stringifySafe()) as EntryCollection<T>;
};

export default removeCircularRefs;
