import { get, map } from 'lodash/fp';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';
import { ContentfulClientApi } from 'contentful';
import { flatten, groupBy, uniq } from 'lodash';
import compose from './compose';
import { createLoader } from './createLoader';
import fetchEntry from './fetchEntry';
import resolveFields from './resolveFields';

interface ContentLoaderConfig {
  client: ContentfulClientApi;
  composers?: any;
  syncAllEntriesForContentType: any;
  transform?: (x: unknown) => unknown;
}

interface Key {
  contentTypeId?: string;
  id?: string;
  slug?: string;
  locale?: string;
}
// const logger = (...args: any) => console.log('ContentLoader', ...args);
// Produces the same key applied to load and when parsing an Entry
const getKey = ({ locale, contentTypeId, slug, id }: Key) => (id ? { locale, id } : { locale, contentTypeId, slug });
const getKeyString = (x: any) => JSON.stringify(getKey(x));

const resolveSettled = (promises) =>
  promises.map((p) => {
    if (p?.status === 'rejected') {
      console.log('Error', p?.reason);
    }
    return p?.value || null;
  });

const extractLocales = (content: any) =>
  uniq(
    Object.values(content.fields).reduce<string[]>(
      (locales: string[], field) => [...locales, ...Object.keys(field)],
      []
    )
  );
const fetchEntries = async ({
  client,
  contentTypeId,
  keys,
  useSyncAPI,
  useFileCache,
  syncAllEntriesForContentType,
  contentJsonDirectory
}) => {
  let entries = [];
  if (useFileCache) {
    // console.log('useFileCache');
    // Dynamic import to prevent fs dependency on client browsers
    const { default: readContentJSON } = await import('./readContentJSON');
    entries = resolveSettled(await Promise.allSettled(keys.map(readContentJSON(contentJsonDirectory))));
  } else if (useSyncAPI) {
    // console.log('useSyncAPI');
    entries = await syncAllEntriesForContentType({ contentTypeId })
      .then(({ entries }) =>
        // Extract all possible locales for each content
        entries.map((content) =>
          extractLocales(content).map((locale) => resolveFields({ content, locale, defaultLocale: 'en-US' }))
        )
      )
      .then(flatten);
  } else {
    // console.log('useFetchAPI');
    entries = resolveSettled(await Promise.allSettled(keys.map(fetchEntry({ client }))));
  }
  // console.log('FetchEntries:entries', entries);

  return entries;
};

const DEFAULT_CONFIG = {
  useSyncAPI: process.env.USE_SYNC_API === 'true' || false,
  useFileCache: process.env.USE_FILE_CACHE === 'true' || false
};
const loadContent = ({
  client,
  composers,
  transform,
  loader,
  useSyncAPI,
  useFileCache,
  syncAllEntriesForContentType,
  contentJsonDirectory
}: ContentLoaderConfig & AdapterConfig & { loader: ContentLoader }) => async (keysAll: Array<Key>) => {
  // logger('loadContent:keys', { loader, keysAll });
  const keysByContentType = groupBy(keysAll, get('contentTypeId'));
  // Initialize the results map for memory optimization
  const results = keysAll.reduce(
    (accum, key) => ({
      ...accum,
      [getKeyString(key)]: { key: getKeyString(key) }
    }),
    {}
  );
  await Promise.all(
    Object.entries(keysByContentType).map(([contentTypeId, keys]) =>
      fetchEntries({
        contentJsonDirectory,
        client,
        contentTypeId,
        keys,
        useSyncAPI,
        useFileCache,
        syncAllEntriesForContentType
      })
    )
  )
    .then(flatten)
    .then((entries) => (transform ? map(transform, entries) : entries))
    .then((entries) => (composers ? Promise.all(map((entry) => compose(composers)({ entry }), entries)) : entries))
    .then(
      map((entry: any) => {
        if (!entry) return null;
        const { slug, locale } = entry;
        const contentTypeId = entry?._contentTypeId ?? entry?.contentTypeId;
        const id = entry?._id ?? entry?.id;
        // Resolve by id

        const idKey = getKeyString({ locale, contentTypeId, id });
        if (results[idKey]) {
          results[idKey] = entry;
        }

        const slugKey = getKeyString({ locale, contentTypeId, slug });
        if (results[slugKey]) {
          results[slugKey] = entry;
        }

        // Prime loader with extra results
        if (loader) {
          if (slug) loader.prime(getKey({ locale, contentTypeId, slug }), entry);
          loader.prime(getKey({ locale, contentTypeId, id }), entry);
        }
        // console.log('Entry', { idKey, slugKey, entry });
      })
    );

  // Use the in memory results map and return the requested items
  const entries = keysAll.map((key) =>
    Object.keys(results[getKeyString(key)]).length == 1 ? null : results[getKeyString(key)]
  );
  // console.log('Sync entries:items', { keysAll, results, entries });
  return entries;
};

class ContentLoader {
  loader: any;
  ready: Promise<void>;
  constructor(config: AdapterConfig & ContentLoaderConfig) {
    const { client, composers } = config;
    const transform = Adapter(config);
    let loader;
    const fetch = loadContent({
      ...DEFAULT_CONFIG,
      client,
      composers,
      transform,
      loader,
      ...config
    });
    this.fetch = fetch;
    this.ready = createLoader<Key>({
      fetch,
      key: getKey
    }).then((loader) => (this.loader = loader));
  }

  async fetch(keys: Key[]) {
    await this.ready;
    return this.fetch(keys);
  }
  async load(key: Key) {
    await this.ready;
    return this.loader?.load(key);
  }
  async loadMany(key: Key[]) {
    await this.ready;
    return this.loader?.loadMany(key);
  }
  async prime(key: Key, value: any) {
    await this.ready;
    return this.loader?.prime(key, value);
  }
  primeAll() {
    console.log('//TODO Implement primeAll');
  }
}

export default ContentLoader;
