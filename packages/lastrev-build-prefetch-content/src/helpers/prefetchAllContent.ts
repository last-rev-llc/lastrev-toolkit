import { NestedParentPathsConfig, PreloadedContentfulContent, ResolvedBuildConfig } from '../types';
import {
  syncAllEntriesForContentType,
  syncAllAssets,
  getContentTypes,
  getLocales,
  Entry
} from '@last-rev/integration-contentful';

import { join } from 'path';

import { each, map, get, keyBy, find, mapValues, isString, pickBy, identity, filter, includes } from 'lodash';
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

const getPathSegments = (
  contentById: { [id: string]: Entry<any> },
  contentId: string,
  nestedPathsConfig: NestedParentPathsConfig,
  depth: number,
  defaultLocale: string,
  pathSegments: string[] = []
): string[] => {
  // reached max depth, return current params
  if (depth === 0) return pathSegments;

  const content = contentById[contentId];

  // something went wrong, invalid path (this will happen if content is deleted but the reference not removed)
  if (!content) throw Error(`Invalid reference to nonexistant item: ${contentId}`);

  const contentTypeId = get(content, 'sys.contentType.sys.id');

  const currentConfig = nestedPathsConfig[contentTypeId];

  // no config for this type, invalid path
  if (!currentConfig) throw Error(`No nestedPaths config for content type: ${contentTypeId}`);

  const { fieldName, parentField } = currentConfig;

  const fieldValue = get(content, `fields.${fieldName}['${defaultLocale}']`);

  if (!isString(fieldValue)) {
    throw Error(`Slug field is not a string! Content ID: ${contentId}, fieldName: ${fieldName}`);
  }

  pathSegments.unshift(fieldValue);

  const parentContentId = get(content, `fields.${parentField}['${defaultLocale}'].sys.id`);

  if (parentContentId) {
    return getPathSegments(contentById, parentContentId, nestedPathsConfig, depth - 1, defaultLocale, pathSegments);
  }

  // reached the end, return segments
  return pathSegments;
};

export default async (buildConfig: ResolvedBuildConfig): Promise<PreloadedContentfulContent> => {
  const { contentJson: contentPrefetchConfig, excludeTypes } = buildConfig;

  const [contentTypes, { defaultLocale, locales }, assetsById] = await Promise.all([
    fetchContentTypes(),
    fetchLocaleData(),
    fetchAssets()
  ]);

  let globalContentById = {};
  const slugToIdByContentType = {};
  const contentFetchTracker = trackProcess('Fetching all entries and assets from Contentful');

  const filteredTypes = filter(contentTypes, (contentType) => !includes(excludeTypes, contentType.sys.id));

  await Promise.all(
    map(filteredTypes, (contentType, index) =>
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

  const {
    paths: { type: pathsType, config: pathsConfig }
  } = buildConfig;

  let contentUrlLookup;
  let pathsByContentType;

  switch (pathsType) {
    case 'Nested Parent': {
      const nestedPaths = pathsConfig as NestedParentPathsConfig;
      pathsByContentType = mapValues(nestedPaths, () => []);
      contentUrlLookup = mapValues(globalContentById, (entry, id) => {
        const contentTypeId = get(entry, 'sys.contentType.sys.id');
        const currentConfig = nestedPaths[contentTypeId];
        if (!currentConfig) return null;

        let slugs: string[];

        try {
          slugs = getPathSegments(globalContentById, id, nestedPaths, currentConfig.maxDepth, defaultLocale);
        } catch (e) {
          console.log(`Unable to load path for ${id}: ${e.message}`);
          return null;
        }

        pathsByContentType[contentTypeId].push({
          params: {
            [currentConfig.paramName]: slugs
          }
        });
        return {
          href: join(currentConfig.root, slugs.join('/')),
          as: join(currentConfig.root, `[...${currentConfig.paramName}]`)
        };
      });
      break;
    }
    case 'Website Sections': {
      throw Error('WSS not currently supported');
    }
    default: {
      // skip for now, do it the old way
    }
  }

  return {
    contentById: globalContentById,
    assetsById,
    locales,
    defaultLocale,
    contentTypes,
    slugToIdByContentType,
    pathsByContentType,
    contentUrlLookup: pickBy(contentUrlLookup, identity)
  };
};
