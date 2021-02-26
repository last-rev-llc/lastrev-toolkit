import { getAllContentItemsForContentType } from '@last-rev/integration-contentful';
import { get, map, each } from 'lodash';
import writeFile from '../../helpers/writeFile';
import mkdirIfNotExists from '../../helpers/mkDirIfNotExists';
import { BuildTask } from '../../types';
import { getDetailPagePaths, getLandingPagePaths } from './helpers';

const hashResults = (results) => {
  const out = {};
  each(results, (result) => {
    const id = get(result, 'sys.id');
    if (!id) return;

    out[id] = result;
  });

  return out;
};

type PathObject = {
  componentId?: string;
  parentId?: string;
  isDomain: boolean;
  domain?: string;
  path: string;
};

const writeWebsiteSectionPaths: BuildTask = async (buildConfig): Promise<void> => {
  await mkdirIfNotExists(buildConfig.outputDirectory);

  const pageContentTypes: string[] = get(buildConfig, 'websiteSectionPathsConfig.pageContentTypes', []);

  if (!pageContentTypes.length) return;

  const contentTypes = ['websiteSection', ...pageContentTypes];
  const [websiteSections, ...otherPageResults] = await Promise.all(
    map(contentTypes, async (contentTypeId) => {
      return hashResults(
        await getAllContentItemsForContentType({
          contentTypeId,
          include: 1
        })
      );
    })
  );

  const paths = {};

  each([...otherPageResults], (pages) => getDetailPagePaths(paths, pages, websiteSections));
  getLandingPagePaths(paths, websiteSections);

  await writeFile(buildConfig.pathsFile, `export default ${JSON.stringify(paths, null, 2)};`, {
    encoding: 'utf8',
    flag: 'w'
  });
};

export default writeWebsiteSectionPaths;
