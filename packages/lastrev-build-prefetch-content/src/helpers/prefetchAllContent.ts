import { PreloadedContentfulContent, ResolvedBuildConfig } from '../types';
import {
  syncAllEntriesForContentType,
  syncAllAssets,
  getContentTypes,
  getLocales
} from '@last-rev/integration-contentful';

import { each, map, get, keyBy, find } from 'lodash';
import trackProcess from './trackProcess';
import delay from './delay';

const fetchContentTypes = async () => {
  const results = await getContentTypes();
  return results.items;
};

const fetchLocaleData = async () => {
  const results = await getLocales();
  const defaultLocale = get(find(results, 'default'), 'code');
  const locales = map(results, 'code');

  return {
    defaultLocale,
    locales
  };
};

const fetchAssets = async () => {
  const results = await syncAllAssets();
  return keyBy(results.assets, 'sys.id');
};

const fetchContentDataByContentType = async ({ contentTypeId, isPage, slugField, defaultLocale }) => {
  const results = await syncAllEntriesForContentType({
    contentTypeId
  });
  const contentById = {};
  const slugToId = {};
  each(results.entries, (entry) => {
    const id = get(entry, 'sys.id');
    contentById[id] = entry;
    if (isPage) {
      const slug = slugField ? get(entry, `fields['${slugField}']['${defaultLocale}']`) : id;
      if (slug) {
        slugToId[slug] = id;
      }
    }
  });

  return {
    contentById,
    slugToId: isPage ? slugToId : null
  };
};

export default async (buildConfig: ResolvedBuildConfig): Promise<PreloadedContentfulContent> => {
  const { contentPrefetch: contentPrefetchConfig } = buildConfig;

  const [contentTypes, { defaultLocale, locales }, assetsById] = await Promise.all([
    fetchContentTypes(),
    fetchLocaleData(),
    fetchAssets()
  ]);

  let globalContentById = {};
  const slugToIdByContentType = {};
  const contentFetchTracker = trackProcess('Fetching all entries and assets from Contentful');

  await Promise.all(
    map(contentTypes, (contentType, index) =>
      (async () => {
        const contentTypeId = contentType.sys.id;
        await delay(index * 100);

        const currentConfig = get(contentPrefetchConfig, contentTypeId);
        const isPage = !!currentConfig;
        const slugField = currentConfig ? get(currentConfig, 'slugField') : null;

        const { contentById, slugToId } = await fetchContentDataByContentType({
          contentTypeId,
          isPage,
          slugField,
          defaultLocale
        });

        globalContentById = {
          ...globalContentById,
          ...contentById
        };

        if (slugToId) {
          slugToIdByContentType[contentTypeId] = slugToId;
        }
      })()
    )
  );

  contentFetchTracker.stop();

  return {
    contentById: globalContentById,
    assetsById,
    locales,
    defaultLocale,
    contentTypes,
    slugToIdByContentType
  };
};
