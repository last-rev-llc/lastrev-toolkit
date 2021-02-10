/* eslint-disable no-param-reassign */
import jsonStringifySafe from 'json-stringify-safe';

import {
  syncAllEntriesForContentType,
  syncAllAssets,
  getContentTypes,
  getLocales
} from '@last-rev/integration-contentful';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';
import { resolve } from 'path';
import { each, map, get, keyBy, find } from 'lodash';
import writeJsonFile from '../helpers/writeJsonFile';
import compose from '../helpers/compose';
import { BuildTask } from '../types';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import trackProcess from '../helpers/trackProcess';
import delay from '../helpers/delay';
import unlinkIfExists from '../helpers/unlinkIfExists';

const fetchContentTypes = async () => {
  const results = await getContentTypes();
  return map(results.items, 'sys.id');
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

const writeContentJson: BuildTask = async (
  buildConfig,
  { adapterConfig }: { adapterConfig: AdapterConfig }
): Promise<void> => {
  const { useAdapter, contentPrefetch: contentPrefetchConfig, contentJsonDirectory } = buildConfig;

  const beginTime = Date.now();

  const transform = useAdapter ? Adapter(adapterConfig) : (a) => a;

  const [contentTypes, { defaultLocale, locales }, assetsById] = await Promise.all([
    fetchContentTypes(),
    fetchLocaleData(),
    fetchAssets()
  ]);

  let globalContentById = {};
  const slugToIdByContentType = {};
  const contentFetchTracker = trackProcess('Fetching all entries and assets from Contentful');

  await Promise.all(
    map(contentTypes, (contentTypeId, index) =>
      (async () => {
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

  const composeTracker = trackProcess('Composing, transforming, and writing content JSON files');

  await Promise.all(
    map(locales, (locale) =>
      (async () => {
        const localeDir = resolve(contentJsonDirectory, locale);

        await Promise.all(
          map(slugToIdByContentType, (slugToId, pageContentTypeId) =>
            (async () => {
              const cpfConfig = get(contentPrefetchConfig, pageContentTypeId);
              const { include = 1, rootOmitFields = [], childOmitFields = [] } = cpfConfig;

              const pageContentTypeDir = resolve(localeDir, pageContentTypeId);

              await mkdirIfNotExists(pageContentTypeDir);

              await Promise.all(
                map(slugToId, (pageContentId, slug) =>
                  (async () => {
                    const composed = compose({
                      contentId: pageContentId,
                      include,
                      contentById: globalContentById,
                      assetsById,
                      locale,
                      defaultLocale,
                      rootOmitFields,
                      childOmitFields
                    });

                    const transformed = transform(JSON.parse(jsonStringifySafe(composed)));

                    const filename = resolve(pageContentTypeDir, `${slug}.json`);

                    await unlinkIfExists(filename);

                    writeJsonFile(filename, transformed);
                  })()
                )
              );
            })()
          )
        );
      })()
    )
  );

  composeTracker.stop();

  console.log(`Total Time: ${(Date.now() - beginTime) / 1000}s`);
};

export default writeContentJson;
