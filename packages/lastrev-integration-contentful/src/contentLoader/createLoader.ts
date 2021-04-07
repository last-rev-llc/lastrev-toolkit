import { Asset, Entry } from 'contentful';
import DataLoader from 'dataloader';
import { keyBy, get } from 'lodash/fp';

export type Item<T> = Entry<T> | Asset;
export type FetchFunction<T> = (keys?: readonly any[]) => Promise<Array<Item<T>>>;
export type ContentfulDataLoader<T> = DataLoader<any, Item<T>> & { primeAll: () => Promise<any>; id: number };

let loaderId = 1;
type Key = string | [string] | ((x: any) => any);
interface LoaderConfig<T> {
  fetch: FetchFunction<T>;
  key: Key;
  lazy?: boolean;
}

const parseKey = (key: Key, x: any) => {
  if (!x) return null;
  if (typeof key === 'string' || Array.isArray(key)) {
    return get(key, x);
  } else if (typeof key === 'function') {
    return key(x);
  }
};

export const createLoader = async <T>({ fetch, key = 'sys.id', lazy = true, ...options }: LoaderConfig<T>) => {
  const loader = new DataLoader(
    async (keys: readonly any[]) => {
      console.log('FETCH', { keys });
      // Fetch all items we can
      const items = await fetch(keys);
      // primeLoader(loader, () => Promise.resolve(items), key);

      const byKey = keyBy((x) => parseKey(key, x), items);
      const result = keys.map((x: any) => byKey[parseKey(key, x)]);
      console.log('Load', { keys, result });
      return result;
    },
    {
      ...options,
      // TODO Implement stable cacheKey
      cacheKeyFn: JSON.stringify
    }
  ) as ContentfulDataLoader<T>;
  loader.id = ++loaderId;
  loader.primeAll = () => primeLoader(loader, fetch, key);

  if (!lazy) return loader.primeAll();
  return loader;
};

type PrimeLoader = <T>(
  loader: ContentfulDataLoader<T>,
  fetch: FetchFunction<T>,
  key: Key,
  lazy?: boolean
) => Promise<ContentfulDataLoader<T>>;

export const primeLoader: PrimeLoader = async (loader, fetch, key = 'sys.id') => {
  console.log(`PrimeLoader:${loader.id}:${key}:start`);
  console.time(`PrimeLoader:${loader.id}:${key}:end`);
  const entries = await fetch();
  entries.map((x: any) => loader.prime(key, x));
  //Return loader to chain
  console.timeEnd(`PrimeLoader:${loader.id}:${key}:end`);
  console.log('Prime', entries.length);

  return loader;
};
