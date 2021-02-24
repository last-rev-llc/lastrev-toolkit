import { Entry } from 'contentful';
import { get, forOwn, mapValues, isString } from 'lodash';

import writeFile from '../helpers/writeFile';
import { BuildTask, NestedPathsConfig } from '../types';

const writePathsFile = async (pathsFile: string, pathsObject) => {
  const jsonOutput = JSON.stringify(pathsObject, null, 2);

  // if outputfile has js extension, write it as a js module, else write it as plain json;
  const out = pathsFile.endsWith('.js') ? `export default ${jsonOutput};` : jsonOutput;

  await writeFile(pathsFile, out);
};

const getPathSegments = (
  contentById: { [id: string]: Entry<any> },
  contentId: string,
  nestedPathsConfig: NestedPathsConfig,
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

const writeNestedPaths: BuildTask = async (buildConfig, prefetchedContent): Promise<void> => {
  if (!prefetchedContent) {
    throw Error('writeNestedPaths will only work with prefetched content. set writeContentJSON:true in .lastrevrc.');
  }
  if (!buildConfig.nestedPaths) {
    throw Error('no nestedPaths config found in .lastrevrc!');
  }

  const { nestedPaths } = buildConfig;
  const { contentById, defaultLocale } = prefetchedContent;

  const pathsObject: { [contentTypeId: string]: string[][] } = mapValues(nestedPaths, () => []);
  forOwn(contentById, (entry, id) => {
    const contentTypeId = get(entry, 'sys.contentType.sys.id');
    const currentConfig = nestedPaths[contentTypeId];
    if (!currentConfig) return;

    let slugs;

    try {
      slugs = getPathSegments(contentById, id, nestedPaths, currentConfig.maxDepth, defaultLocale);
    } catch (e) {
      console.log(`Unable to load path for ${id}: ${e.message}`);
      return;
    }

    pathsObject[contentTypeId].push(slugs);
  });

  writePathsFile(buildConfig.pathsFile, pathsObject);
};

export default writeNestedPaths;
