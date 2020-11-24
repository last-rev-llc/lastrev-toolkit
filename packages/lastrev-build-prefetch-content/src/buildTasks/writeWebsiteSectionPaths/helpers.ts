import { get, set, each, every } from 'lodash';

const detailPageVisitor = (page) => {
  const targets = get(page, 'fields.targeting');
  const contentTypeId = get(page, 'sys.contentType.sys.id');
  const slug = get(page, 'fields.slug');

  return { targets, contentTypeId, path: `/${slug}`, isValid: !!slug };
};

const websiteSectionVisitor = (
  websiteSection,
  {
    contentId: prevContentId,
    contentTypeId: prevContentTypeId,
    componentId: prevComponentId,
    isDetailPageParent,
    isFirstLevelWebsiteSection,
    path: prevPath,
    websiteSections
  }
) => {
  let contentTypeId = prevContentTypeId;
  let componentId = prevComponentId;
  let contentId = prevContentId;

  if (isFirstLevelWebsiteSection) {
    if (isDetailPageParent) {
      componentId = get(websiteSection, `fields.childPageAssociations.${contentTypeId}.id`);
    } else {
      contentId = get(websiteSection, 'fields.landingPage.sys.id');
      contentTypeId = get(websiteSection, 'fields.landingPage.sys.contentType.sys.id');
      componentId = get(websiteSection, 'fields.landingPageComponent.id');
    }
  }
  const parent = get(websiteSections, get(websiteSection, 'fields.parent.sys.id'));
  const isDomain = get(websiteSection, 'fields.isDomain');
  const domain = get(websiteSection, 'fields.domain');
  const slug = get(websiteSection, 'fields.slug');
  const path = isDomain ? (prevPath ? prevPath : '/') : `/${slug}${prevPath}`;

  if (isDomain) {
    return {
      domain,
      path,
      componentId,
      contentId,
      contentTypeId,
      isValid: every([domain, path, componentId, contentId, contentTypeId])
    };
  } else if (!every([parent, slug, componentId, contentId, contentTypeId])) {
    return { isValid: false };
  }
  return websiteSectionVisitor(parent, {
    contentId,
    contentTypeId,
    componentId,
    isDetailPageParent: false,
    isFirstLevelWebsiteSection: false,
    path,
    websiteSections
  });
};

export const getDetailPagePaths = (paths, pages, websiteSections) => {
  each(pages, (page, contentId) => {
    const { targets, contentTypeId, path, isValid } = detailPageVisitor(page);
    if (!isValid) return;
    each(targets, (websiteSection) => {
      const { domain, path: finalPath, componentId, isValid: isWssValid } = websiteSectionVisitor(websiteSection, {
        contentId,
        contentTypeId,
        componentId: null,
        isDetailPageParent: true,
        isFirstLevelWebsiteSection: true,
        path,
        websiteSections
      });
      if (!isWssValid) return;
      set(paths, `['${domain}']['${finalPath}']`, { componentId, contentId, contentTypeId });
    });
  });
};

export const getLandingPagePaths = (paths, websiteSections) => {
  each(websiteSections, (websiteSection) => {
    const { contentId, contentTypeId, domain, path, componentId, isValid } = websiteSectionVisitor(websiteSection, {
      contentId: null,
      contentTypeId: null,
      componentId: null,
      isDetailPageParent: false,
      isFirstLevelWebsiteSection: true,
      path: '',
      websiteSections
    });
    if (!isValid) return;
    set(paths, `['${domain}']['${path}']`, { componentId, contentId, contentTypeId });
  });
};
