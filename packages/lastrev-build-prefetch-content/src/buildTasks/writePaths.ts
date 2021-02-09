import { getStaticSlugsForContentType, Entry } from '@last-rev/integration-contentful';
import { each, get, merge, map, filter, values, identity, every } from 'lodash';

import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildTask, ComplexPathConfig, SimplePathConfig, PathChildrenConfig, ResolvedBuildConfig } from '../types';

function isString(s): s is string {
  return typeof s === 'string';
}

function isSimplePathConfig(s): s is SimplePathConfig {
  return isString(s);
}

type PathsRepresentation = Record<string, string>[];
type PathsRepresentationTuple = [string, PathsRepresentation];

const writePathsJs = async (pathsFile: string, ...pathsRepresentationTuples: PathsRepresentationTuple[]) => {
  const paths = {};
  each(pathsRepresentationTuples, ([type, pathsRepresentation]) => {
    paths[type] = pathsRepresentation.map((params) => {
      return {
        params
      };
    });
  });

  const out = `export default ${JSON.stringify(paths, null, 2)};`;
  await writeFile(pathsFile, out);
};

const convertSimpleToComplexPathConfig = (contentType: string, slugParam: string): ComplexPathConfig => {
  return {
    param: slugParam,
    contentType
  };
};

const dfs = (
  configNode: PathChildrenConfig,
  resultNode: Entry<unknown>,
  results: PathsRepresentation,
  stack: Record<string, string>[]
) => {
  const old = stack[stack.length - 1];
  const obj = {};
  const slug = get(resultNode, `fields.slug`) as string;

  obj[configNode.param] = slug;

  stack.push(merge(obj, old));

  if (!configNode.children) {
    results.push(stack.pop());
  } else {
    const childNode = configNode.children;
    each(get(resultNode, `fields.${configNode.fieldName}`), (subResultNode) => {
      dfs(childNode, subResultNode, results, stack);
    });
  }
};

const cleanUpPathsRepresentation = (pathsRepresentation: PathsRepresentation): PathsRepresentation => {
  return filter(pathsRepresentation, (obj) => every(values(obj), identity));
};

const getComplexStaticSlugs = async (pathConfig: ComplexPathConfig, key: string): Promise<PathsRepresentationTuple> => {
  const { param: rootParam } = pathConfig;
  const { contentType } = pathConfig;
  let { children } = pathConfig;
  let include = 1;
  let nestedFieldName: string;

  while (children) {
    if (!nestedFieldName) nestedFieldName = children.fieldName;
    include += 1;
    ({ children } = children);
  }

  const results = await getStaticSlugsForContentType({ contentTypeId: contentType, nestedFieldName, include });

  const pathsRepresentation: PathsRepresentation = [];

  each(results, (result) => {
    if (isString(result)) {
      const out: Record<string, string> = {};
      out[rootParam] = result;
      pathsRepresentation.push(out);
      /*
        [{
          "slug": "home"
        }]
      */
    } else {
      const rootSlug = result[0];
      const nested = result[1];

      const obj = {};
      obj[rootParam] = rootSlug;

      const stack = [obj];

      each(nested, (nestedItem) => {
        dfs(pathConfig.children, nestedItem, pathsRepresentation, stack);
      });
      /*
        [{
          "courseSlug": "admin",
          "topicSlug": "topic-1"
        }]
      */
    }
  });

  return [key, cleanUpPathsRepresentation(pathsRepresentation)];
};

const getStaticSlugFunctions = (buildConfig: ResolvedBuildConfig): Promise<PathsRepresentationTuple>[] => {
  if (!buildConfig || !buildConfig.paths) return [];
  return map(buildConfig.paths, (value, key) => {
    const conf: ComplexPathConfig = isSimplePathConfig(value) ? convertSimpleToComplexPathConfig(key, value) : value;
    return getComplexStaticSlugs(conf, key);
  });
};

const writePaths: BuildTask = async (buildConfig): Promise<void> => {
  const { outputDirectory, pathsFile } = buildConfig;

  await mkdirIfNotExists(outputDirectory);

  const staticSlugFunctions = getStaticSlugFunctions(buildConfig);

  const [...typeSlugTuples]: [...PathsRepresentationTuple[]] = await Promise.all([...staticSlugFunctions]);
  await writePathsJs(pathsFile, ...typeSlugTuples);
};

export default writePaths;
