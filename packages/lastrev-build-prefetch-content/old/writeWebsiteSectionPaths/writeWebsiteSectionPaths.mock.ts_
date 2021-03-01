import faker from 'faker';

export const LANDING_PAGE_TYPE = 'landingPage';
export const DETAIL_PAGE_TYPE = 'detailPage';

export const createWebsiteSection = (isDomain) => {
  return {
    sys: {
      id: faker.random.alphaNumeric(10),
      contentType: {
        sys: {
          id: 'websiteSection'
        }
      }
    },
    fields: {
      isDomain,
      domain: isDomain ? faker.internet.domainName() : undefined,
      parent: isDomain ? undefined : createWebsiteSection(true),
      landingPage: createDetailPage(LANDING_PAGE_TYPE, false),
      landingPageComponent: {
        id: faker.random.alphaNumeric(2)
      },
      childPageAssociations: {
        [DETAIL_PAGE_TYPE]: {
          id: faker.random.alphaNumeric(2)
        }
      },
      slug: isDomain ? undefined : faker.random.word()
    }
  };
};

export const createDetailPage = (contentType, hasParents) => {
  return {
    sys: {
      id: faker.random.alphaNumeric(10),
      contentType: {
        sys: {
          id: contentType
        }
      }
    },
    fields: {
      targeting: hasParents ? [createWebsiteSection(false), createWebsiteSection(false)] : undefined,
      slug: faker.random.word()
    }
  };
};
