import Adapter from './contentfulAdapter';
import mockContent from './contentfulAdapter.mock';

const urlMap = {
  pageGeneral: {
    url: '/[key]',
    key: 'slug'
  }
};

const transform = Adapter({
  urlMap,
  linkContentType: 'uieCta',
  manualEntryTypeText: 'Manual URL',
  modalActionText: 'Open a modal',
  contentRefTypeText: 'ContentReference'
});

describe('Contentful Adapter', () => {
  it('converts the data correctly', () => {
    const out = transform(mockContent);
    expect(out).toMatchSnapshot();
  });
  it('parses plain json correctly', () => {
    const obj = {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'hhv516v5f7sj'
          }
        },
        type: 'Entry',
        id: '1wmrGhKeCNbe3QssB6UNkN',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'settingsGlobal'
          }
        },
        revision: 2,
        createdAt: '2020-07-01T20:03:32.191Z',
        updatedAt: '2020-07-06T23:50:58.713Z',
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment'
          }
        },
        locale: 'en-US'
      },
      fields: {
        localizationLookup: {
          recipeMinutes: 'min',
          loginLinkLabel: 'LOG IN',
          loginDescription: 'Already have an Impossible Taste Place™ account? Log in here.',
          logOutButtonLabel: 'LOG OUT',
          operatorLoginPreText: 'Restaurant operators',
          createAccountLinkLabel: 'Sign up for Taste Place here.',
          operatorLoginLinkLabel: 'log in here.',
          createAccountDescription: 'Earn rewards with each purchase. Save earth. Connect with other Impossible fans.'
        }
      }
    };
    const out = transform(obj);
    expect(out).toMatchSnapshot();
  });
});
