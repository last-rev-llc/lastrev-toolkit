/* eslint-disable no-param-reassign */
import jsonStringifySafe from 'json-stringify-safe';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';
import { resolve } from 'path';
import { map, get } from 'lodash';
import writeJsonFile from '../helpers/writeJsonFile';
import compose from '../helpers/compose';
import { BuildTask } from '../types';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import trackProcess from '../helpers/trackProcess';
import unlinkIfExists from '../helpers/unlinkIfExists';

const getTransformedContent: BuildTask = async (
  buildConfig,
  preloadedContent,
  { adapterConfig }: { adapterConfig: AdapterConfig }
): Promise<void> => {
  if (!preloadedContent) {
    throw Error('getTransformedContentJSON requires content to be pre-loaded!');
  }

  const {
    locales,
    contentById: globalContentById,
    assetsById,
    defaultLocale,
    slugToIdByContentType
  } = preloadedContent;

  const { useAdapter, contentJson: contentPrefetchConfig, contentJsonDirectory } = buildConfig;

  const { contentUrlLookup } = preloadedContent;

  const transform = useAdapter ? Adapter({ ...adapterConfig, contentUrlLookup }) : (a) => a;

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

              // const pageContentTypeDir = resolve(localeDir, pageContentTypeId);

              // await mkdirIfNotExists(pageContentTypeDir);

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

                    return transformed;
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
};

export default getTransformedContent;
