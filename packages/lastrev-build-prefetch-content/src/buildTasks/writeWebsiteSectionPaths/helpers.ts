import { get, set, each, every } from 'lodash';

// visits a detain page to return data needed to build paths from website sections
const detailPageVisitor = (page) => {
  const targets = get(page, 'fields.targeting', []);
  const contentTypeId = get(page, 'sys.contentType.sys.id');
  const slug = get(page, 'fields.slug');

  // a page is not valid if it does not have a slug
  return { targets, contentTypeId, path: `/${slug}`, isValid: !!slug };
};

// visits each website section in the hierarchy to build a path
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
    // at the first level WSS (landing page or parent of detail page) we get the component associations
    // if these dont exist for a specific content type, the page is not valid
    if (isDetailPageParent) {
      // if it is a detail page parent, we look at the childPageAssociations
      componentId = get(websiteSection, `fields.childPageAssociations.${contentTypeId}.id`);
    } else {
      // if it is a landing page, we look at the landsingPage and landingPageComponent
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
    // if we have iterated through the hierarchy, landed on a a domain, and have the component associations, this is a valid WSS
    return {
      domain,
      path,
      componentId,
      contentId,
      contentTypeId,
      isValid: every([domain, path, componentId, contentId, contentTypeId])
    };
  } else if (!every([parent, slug, componentId, contentId, contentTypeId])) {
    // if we are not at the domain level, and there is no parent, or there are no associations, this is not a valid component.
    return { isValid: false };
  }
  // if we are not at the domain level, keep going up the parent hierarchy, appending to the path, until a domain is reached.
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
