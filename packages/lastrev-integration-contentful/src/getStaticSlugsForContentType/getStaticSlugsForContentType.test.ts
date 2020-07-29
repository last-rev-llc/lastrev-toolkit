import faker from 'faker';
import _ from 'lodash';

import { createClient } from 'contentful';
import getStaticSlugsForContentTypeCreator from './getStaticSlugsForContentType';

const client = createClient({
  space: 'something',
  environment: 'master',
  accessToken: 'seomethingelse',
  host: 'preview.contentful.com'
});

const getStaticSlugsForContentType = getStaticSlugsForContentTypeCreator(client);

const slugs: string[] = [];
for (let i = 0; i < 1250; i++) {
  slugs.push(faker.random.word());
}

const items = _.map(slugs, (slug) => {
  return { fields: { slug } };
});

describe('getStaticSlugsForContentType', () => {
  test('pagination', async () => {
    client.getEntries = jest
      .fn()
      .mockImplementationOnce(() => {
        return Promise.resolve({
          items: items.slice(0, 1000),
          skip: 0,
          total: 1250,
          limit: 1000
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          items: items.slice(1000, 1250),
          skip: 1000,
          total: 1250,
          limit: 1000
        });
      });

    const staticSlugs = await getStaticSlugsForContentType({
      contentTypeId: 'someType'
    });

    expect(staticSlugs).toEqual(slugs);
  });
  test('missing slug', async () => {
    const items2 = [
      {
        fields: {
          slug: 'hi'
        },
        sys: {}
      },
      {
        sys: {}
      }
    ];
    client.getEntries = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        items: items2,
        skip: 0,
        total: 2,
        limit: 100
      });
    });

    const staticSlugs = await getStaticSlugsForContentType({
      contentTypeId: 'someType'
    });

    expect(staticSlugs).toEqual(['hi']);
  });
  test('returns zero items', async () => {
    client.getEntries = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        items: [],
        skip: 0,
        total: 0,
        limit: 100
      });
    });

    const staticSlugs = await getStaticSlugsForContentType({
      contentTypeId: 'someType'
    });

    expect(staticSlugs).toEqual([]);
  });
});
