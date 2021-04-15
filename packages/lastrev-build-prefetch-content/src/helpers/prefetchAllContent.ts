import { NestedParentPathsConfig, PreloadedContentfulContent, ResolvedBuildConfig } from '../types';
import {
  syncAllEntriesForContentType,
  syncAllAssets,
  getContentTypes,
  getLocales,
  Entry
} from '@last-rev/integration-contentful';

import urlJoin from 'url-join';

import { each, map, get, keyBy, find, mapValues, isString, pickBy, identity, filter, includes, omitBy } from 'lodash';
import trackProcess from './trackProcess';
import delay from './delay';
import excludeContent from './excludeContent';
import getRootDomain from './getRootDomain';

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
  const slugToId: { [slug: string]: string } = {};
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
  shouldBeExcluded: (parent: Entry<any>) => boolean,
  pathSegments: string[] = []
): string[] => {
  // reached max depth, return current params
  if (depth === 0) return pathSegments;

  const content = contentById[contentId];

  if (shouldBeExcluded(content)) {
    throw Error(`Parent excluded: ${contentId}`);
  }

  // something went wrong, invalid path (this will happen if content is deleted but the reference not removed)
  if (!content) throw Error(`Invalid reference to nonexistent item: ${contentId}`);

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
    return getPathSegments(
      contentById,
      parentContentId,
      nestedPathsConfig,
      depth - 1,
      defaultLocale,
      shouldBeExcluded,
      pathSegments
    );
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

        const { exclude, excludeIfParentIsExcluded } = excludeContent(buildConfig, entry, defaultLocale);

        if (exclude) {
          return {
            href: null,
            as: null
          };
        }

        let slugs: string[];

        try {
          slugs = getPathSegments(
            globalContentById,
            id,
            nestedPaths,
            currentConfig.maxDepth,
            defaultLocale,
            (parent) => {
              if (!excludeIfParentIsExcluded) return false;
              return excludeContent(buildConfig, parent, defaultLocale).exclude;
            }
          );
        } catch (e) {
          console.log(`did not generate path data. Reason: ${e.message}`);
          return {
            href: null,
            as: null
          };
        }

        pathsByContentType[contentTypeId].push({
          params: {
            [currentConfig.paramName]: slugs
          }
        });
        
        const rootPath = `${getRootDomain(entry, currentConfig)}${currentConfig.root}`;

        return {
          href: urlJoin(rootPath, `[...${currentConfig.paramName}]`),
          as: urlJoin(rootPath, slugs.join('/'))
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
