import { EntryCollection } from 'contentful';

const removeCircularRefs = <T>(entries: EntryCollection<T>): EntryCollection<T> => {
  return JSON.parse(entries.stringifySafe());
};

export default removeCircularRefs;
