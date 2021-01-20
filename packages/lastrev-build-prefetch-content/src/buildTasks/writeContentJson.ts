/* eslint-disable no-param-reassign */
import jsonStringifySafe from 'json-stringify-safe';

import {
  syncAllEntriesForContentType,
  syncAllAssets,
  getContentTypes,
  getLocales
} from '@last-rev/integration-contentful';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';
import { each, map, get, keyBy, find } from 'lodash';
import { join } from 'path';
import writeJsonFile from '../helpers/writeJsonFile';
import compose from '../helpers/compose';
import { BuildConfig, BuildTask, ContentPrefetchConfig } from '../types';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { CONTENT_DIR, CONTENT_JSON_DIR, DEFAULT_SLUG_FIELD } from '../constants';
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

const fetchContentDataByContentType = async ({ contentTypeId, slugField, defaultLocale }) => {
  const results = await syncAllEntriesForContentType({
    contentTypeId
  });
  const contentById = {};
  const slugToId = {};
  each(results.entries, (entry) => {
    const id = get(entry, 'sys.id');
    contentById[id] = entry;
    const slug = get(entry, `fields['${slugField}']['${defaultLocale}']`);
    if (slug) {
      slugToId[slug] = id;
    }
  });

  return {
    contentById,
    slugToId: slugField ? slugToId : null
  };
};

const writeContentJson: BuildTask = async (
  { useAdapter, contentPrefetch: contentPrefetchConfig }: BuildConfig,
  { adapterConfig }: { adapterConfig: AdapterConfig }
): Promise<void> => {
  await mkdirIfNotExists(CONTENT_DIR);
  await mkdirIfNotExists(CONTENT_JSON_DIR);

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
        const slugField = currentConfig ? get(currentConfig, 'slugField', DEFAULT_SLUG_FIELD) : null;

        const { contentById, slugToId } = await fetchContentDataByContentType({
          contentTypeId,
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
        const localeDir = join(CONTENT_JSON_DIR, locale);

        await mkdirIfNotExists(localeDir);

        await Promise.all(
          map(slugToIdByContentType, (slugToId, pageContentTypeId) =>
            (async () => {
              const cpfConfig = get(contentPrefetchConfig, pageContentTypeId);
              const { include = 1, rootOmitFields = [], childOmitFields = [] } = cpfConfig;

              const pageContentTypeDir = join(localeDir, pageContentTypeId);

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

                    const filename = join(pageContentTypeDir, `${slug}.json`);

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
