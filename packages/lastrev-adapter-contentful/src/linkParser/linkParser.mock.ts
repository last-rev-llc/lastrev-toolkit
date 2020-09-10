import faker from 'faker';
import { Entry, Asset } from 'contentful';
import mockEntry, { MockEntryType } from '../entryParser/entryParser.mock';
import mockAsset from '../assetParser/assetParser.mock';

export type MockLinkEntryType = Entry<{
  linkText: string;
  action: string;
  destinationType: string;
  assetReference: Asset;
  contentReference: MockEntryType;
  manualUrl: string;
}>;

export default (): MockLinkEntryType => {
  const link: MockLinkEntryType = {
    sys: {
      id: faker.random.alphaNumeric(10),
      type: 'Asset',
      locale: faker.random.locale(),
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'elementLink'
        }
      },
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: faker.random.alphaNumeric(10)
        }
      },
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      revision: faker.random.number()
    },
    fields: {
      linkText: 'hello',
      action: 'Open in the same window',
      destinationType: 'Asset reference',
      assetReference: mockAsset(true),
      contentReference: mockEntry(),
      manualUrl: faker.internet.url()
    },
    toPlainObject: () => ({}),
    update: () => {
      return new Promise((resolve) => {
        resolve(link);
      });
    }
  };
  return link;
};
