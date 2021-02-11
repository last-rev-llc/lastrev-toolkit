import { createDetailPage, DETAIL_PAGE_TYPE, LANDING_PAGE_TYPE } from './writeWebsiteSectionPaths.mock';
import { getDetailPagePaths, getLandingPagePaths } from './helpers';
import { each, filter, find, get } from 'lodash';

let detailPage;
let websiteSections;
let paths;

beforeEach(() => {
  paths = {};
  detailPage = createDetailPage(DETAIL_PAGE_TYPE, true);
  websiteSections = {
    [detailPage.fields.targeting[0].sys.id]: detailPage.fields.targeting[0],
    [detailPage.fields.targeting[1].sys.id]: detailPage.fields.targeting[1],
    [detailPage.fields.targeting[0].fields.parent.sys.id]: detailPage.fields.targeting[0].fields.parent,
    [detailPage.fields.targeting[1].fields.parent.sys.id]: detailPage.fields.targeting[1].fields.parent
  };
});

const runForDetailPage = () => getDetailPagePaths(paths, { [detailPage.sys.id]: detailPage }, websiteSections);
const runForLandingPages = () => getLandingPagePaths(paths, websiteSections);

describe('writeWebsiteSectionPaths.helpers', () => {
  describe('getDetailPagePaths', () => {
    it('generates correct paths for valid pages', () => {
      runForDetailPage();

      expect(paths).toEqual({
        [detailPage.fields.targeting[0].fields.parent.fields.domain]: {
          [`/${detailPage.fields.targeting[0].fields.slug}/${detailPage.fields.slug}`]: {
            componentId: detailPage.fields.targeting[0].fields.childPageAssociations[DETAIL_PAGE_TYPE].id,
            contentId: detailPage.sys.id,
            contentTypeId: DETAIL_PAGE_TYPE
          }
        },
        [detailPage.fields.targeting[1].fields.parent.fields.domain]: {
          [`/${detailPage.fields.targeting[1].fields.slug}/${detailPage.fields.slug}`]: {
            componentId: detailPage.fields.targeting[1].fields.childPageAssociations[DETAIL_PAGE_TYPE].id,
            contentId: detailPage.sys.id,
            contentTypeId: DETAIL_PAGE_TYPE
          }
        }
      });
    });

    it('does not generate paths for detail pages without slugs', () => {
      detailPage.fields.slug = undefined;

      runForDetailPage();

      expect(paths).toEqual({});
    });

    it('does not generate paths for untargeted pages', () => {
      detailPage.fields.targeting = [];

      runForDetailPage();

      expect(paths).toEqual({});
    });

    it('does not generate paths for pages targeted to non-domain website sections without slugs', () => {
      each(websiteSections, (websiteSection) => {
        websiteSection.fields.slug = undefined;
      });

      runForDetailPage();

      expect(paths).toEqual({});
    });

    it('does not generate paths for pages targeted to domain website sections without domains', () => {
      each(websiteSections, (websiteSection) => {
        websiteSection.fields.domain = undefined;
      });

      runForDetailPage();

      expect(paths).toEqual({});
    });
  });

  describe('getLandingPagePaths', () => {
    it('generates correct paths for valid landing pages', () => {
      runForLandingPages();

      console.log(JSON.stringify(paths, null, 2));

      const expected = {};
      const domainsSections = filter(websiteSections, (websiteSection) => {
        return websiteSection.fields.isDomain;
      });
      each(domainsSections, (domainSection) => {
        const targetedSection = find(websiteSections, (websiteSection) => {
          return get(websiteSection, 'fields.parent.sys.id') === domainSection.sys.id;
        });
        expected[domainSection.fields.domain] = {
          '/': {
            componentId: domainSection.fields.landingPageComponent.id,
            contentId: domainSection.fields.landingPage.sys.id,
            contentTypeId: LANDING_PAGE_TYPE
          },
          [`/${targetedSection.fields.slug}`]: {
            componentId: targetedSection.fields.landingPageComponent.id,
            contentId: targetedSection.fields.landingPage.sys.id,
            contentTypeId: LANDING_PAGE_TYPE
          }
        };
      });

      expect(paths).toEqual(expected);
    });

    it('does not generate paths for non-domain landing pages without slugs', () => {
      each(websiteSections, (websiteSection) => {
        websiteSection.fields.slug = undefined;
      });

      runForLandingPages();

      const expected = {};
      const domainsSections = filter(websiteSections, (websiteSection) => {
        return websiteSection.fields.isDomain;
      });
      each(domainsSections, (domainSection) => {
        expected[domainSection.fields.domain] = {
          '/': {
            componentId: domainSection.fields.landingPageComponent.id,
            contentId: domainSection.fields.landingPage.sys.id,
            contentTypeId: LANDING_PAGE_TYPE
          }
        };
      });

      expect(paths).toEqual(expected);
    });

    it('does not generate paths for domain website sections without domains', () => {
      each(websiteSections, (websiteSection) => {
        websiteSection.fields.domain = undefined;
      });

      runForLandingPages();

      expect(paths).toEqual({});
    });
  });
});
