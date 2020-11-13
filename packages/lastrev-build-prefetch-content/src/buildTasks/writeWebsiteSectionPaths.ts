import { getAllContentItemsForContentType } from '@last-rev/integration-contentful';
import { each, get, set, map } from 'lodash';
import { CONTENT_DIR, PATHS_FILE } from '../constants';
import writeFile from '../helpers/writeFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildTask } from '../types';

const hashResults = (results) => {
  const out = {};
  each(results, (result) => {
    const id = get(result, 'sys.id');
    if (!id) return;

    out[id] = result;
  });

  return out;
};

const getDetailPagePaths = (paths, pages, websiteSections) => {
  each(pages, (page, contentId) => {
    const parents = get(page, 'fields.targeting');
    const contentTypeId = get(page, 'sys.contentType.sys.id');
    each(parents, (parent) => {
      let parentId = get(parent, 'sys.id');
      if (!parentId) return;

      let wss;
      let componentId;
      let path = get(page, 'fields.slug');
      let domain;
      while (!domain) {
        wss = get(websiteSections, parentId);
        if (!wss) break;
        if (!componentId) {
          const mapping = get(wss, `fields.childPageAssociations.${contentTypeId}`);
          if (!mapping) break;
          componentId = get(mapping, 'id');
        }

        const isDomain = get(wss, 'fields.isDomain');
        if (isDomain) {
          path = `/${path}`;
          domain = get(wss, 'fields.domain');
          break;
        }

        path = `${get(wss, 'fields.slug')}/${path}`;
        parentId = get(wss, 'fields.parent.sys.id');
      }

      if (domain) {
        set(paths, `['${domain}']['${path}']`, { componentId, contentId, contentTypeId });
      }
    });
  });
};

const getLandingPagePaths = (paths, websiteSections) => {
  each(websiteSections, (websiteSection) => {
    const componentId = get(websiteSection, 'fields.landingPageComponent.id');
    const landingPageId = get(websiteSection, 'fields.landingPage.sys.id');
    const landingPageContentType = get(websiteSection, 'fields.landingPage.sys.contentType.sys.id');
    if (!componentId || !landingPageId || !landingPageContentType) return;
    let wss = websiteSection;
    let domain;
    let path;

    while (wss && !domain) {
      const isDomain = get(wss, 'fields.isDomain');
      if (isDomain) {
        path = path ? `/${path}` : '/';
        domain = get(wss, 'fields.domain');
        break;
      }
      const slug = get(wss, 'fields.slug');
      path = path ? `${slug}/${path}` : slug;
      const parentId = get(wss, 'fields.parent.sys.id');
      wss = get(websiteSections, parentId);
    }

    if (domain) {
      set(paths, `['${domain}']['${path}']`, {
        componentId,
        contentId: landingPageId,
        contentTypeId: landingPageContentType
      });
    }
  });
};

const writeWebsiteSectionPaths: BuildTask = async (buildConfig): Promise<void> => {
  await mkdirIfNotExists(CONTENT_DIR);

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

  await writeFile(PATHS_FILE, `export default ${JSON.stringify(paths, null, 2)};`,
    {
      encoding: 'utf8',
      flag: 'w'
    }
  );
};

export default writeWebsiteSectionPaths;
