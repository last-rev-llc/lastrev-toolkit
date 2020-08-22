import { EntryCollection } from 'contentful';

const removeCircularRefs = <T>(entries: EntryCollection<T>): EntryCollection<T> => {
  return JSON.parse(entries.stringifySafe()) as EntryCollection<T>;
};

export default removeCircularRefs;
