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
interface ContentKey {
  contentTypeId?: string;
  id?: string;
  slug?: string;
  locale?: string;
  displayType?: string;
}
const logger = (...args: any) => (process.env.DEBUG ? console.log('ContentLoader', ...args) : null);
// Produces the same key applied to load and when parsing an Entry
const getKey = ({ locale, contentTypeId, slug, id }: Key) => (id ? { locale, id } : { locale, contentTypeId, slug });
const getKeyString = (x: any) => JSON.stringify(getKey(x));

const resolveSettled = (promises) =>
  promises.map((p) => {
    if (p?.status === 'rejected') {
      logger('Error', p?.reason);
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

// Fetch entries by key from Contentful with FileCache in place
// mode: 'SYNC' | 'FETCH';
const fetchEntries = async ({
  client,
  contentTypeId,
  keys,
  disableFileCache,
  mode = 'FETCH',
  syncAllEntriesForContentType,
  contentJsonDirectory
}) => {
  let entries = [];
  try {
    if (disableFileCache) throw new Error('FileCacheDisabled');
    logger('Use FileCache');
    // Dynamic import to prevent fs dependency on client browsers
    const { default: readContentJSON } = await import('./readContentJSON');
    // Any file not found means we are out of sync so fail early and fetch from API
    entries = await Promise.all(keys.map((key) => readContentJSON(contentJsonDirectory)(key)));
  } catch (error) {
    // logger(error);
    // logger(`use${mode}`);
    switch (mode) {
      case 'SYNC':
        entries = await syncAllEntriesForContentType({ contentTypeId })
          .then(({ entries }) =>
            // Extract all possible locales for each content
            // TODO need to add displayType from keys
            entries.map((content) =>
              extractLocales(content).map((locale) => resolveFields({ content, locale, defaultLocale: 'en-US' }))
            )
          )
          .then(flatten);

        break;
      case 'FETCH':
        entries = resolveSettled(await Promise.allSettled(keys.map((key) => fetchEntry({ client })(key))));
        break;
    }
  }

  logger('FetchEntries:entries', entries.length);
  return entries;
};

const DEFAULT_CONFIG: { mode: 'SYNC' | 'FETCH'; disableFileCache?: boolean } = {
  mode: process.env.USE_SYNC_API === 'true' ? 'SYNC' : 'FETCH',
  disableFileCache: !!process.env.DISABLE_FILE_CACHE && process.env.DISABLE_FILE_CACHE === 'true'
};
const loadContent = async ({
  keysAll,
  client,
  transform,
  loader,
  mode,
  disableFileCache,
  syncAllEntriesForContentType,
  contentJsonDirectory
}: ContentLoaderConfig & AdapterConfig & { loader: ContentLoader; keysAll: Array<Key> }) => {
  logger('loadContent:keys', { keysAll });
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
        mode,
        disableFileCache,
        syncAllEntriesForContentType
      })
    )
  )
    .then(flatten)
    .then((entries) => (transform ? map(transform, entries) : entries))
    .then(
      map((entry: any) => {
        // Save each result in memory and prime loader with extra results
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
        logger('Entry', { idKey, slugKey, entry });
      })
    );

  // Use the in memory results map and return the requested items
  const entries = keysAll.map((key) =>
    Object.keys(results[getKeyString(key)]).length == 1 ? null : results[getKeyString(key)]
  );
  logger('FetchEntries:items', { keysAll, results, entries });
  return entries;
};

class ContentLoader {
  loader: any;
  ready: Promise<void>;
  config: AdapterConfig & ContentLoaderConfig;
  constructor(config: AdapterConfig & ContentLoaderConfig) {
    this.config = config;
    const { client } = this.config;
    const transform = Adapter(config);
    const fetch = async (keysAll: Array<ContentKey>) =>
      loadContent({
        ...DEFAULT_CONFIG,
        client,
        transform,
        loader: this.loader,
        ...config,
        keysAll
      });
    this.fetch = fetch;
    this.ready = createLoader<Key>({
      fetch,
      key: getKey
    }).then((loader) => (this.loader = loader));
  }

  async fetch(keys: ContentKey[]) {
    await this.ready;
    return this.fetch(keys);
  }
  async load(key: ContentKey) {
    await this.ready;
    return this.loader
      ?.load(key)
      .then((entry) =>
        compose({ composers: this.config.composers, loader: this.loader })({ entry, displayType: key.displayType })
      );
  }
  async loadMany(keys: ContentKey[]) {
    await this.ready;
    return this.loader?.loadMany(keys).then((entries) =>
      Promise.all(
        entries.map((entry, i) =>
          compose({ composers: this.config.composers, loader: this.loader })({
            entry,
            displayType: keys[i]?.displayType
          })
        )
      )
    );
  }
  async prime(key: ContentKey, value: any) {
    await this.ready;
    return this.loader?.prime(key, value);
  }
  primeAll() {
    logger('//TODO Implement primeAll');
  }
}

export default ContentLoader;
