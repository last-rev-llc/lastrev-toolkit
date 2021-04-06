import { contentTypes } from './../../../lastrev-build-prefetch-content/src/getComponentMappings/getComponentMappings.mock';
import ContentLoader from './contentLoader';
import mockContent from './contentLoader.mock';

const urlMap = {};

const contentLoader = new ContentLoader({
  ...config,
  client
});

describe('Content Loader', () => {
  it('lodas data via Sync API ', async () => {
    const out = await contentLoader.load({
      contentTypeId: 'mock',
      locale: 'en-US',
      id: '1'
    });
    expect(out).toMatchObject({
      id: '1',
      contentTypeId: 'mock',
      locale: 'en-US'
    });
  });
  it('lodas data via Preview API ', async () => {
    const out = await contentLoader.load({
      contentTypeId: 'mock',
      locale: 'en-US',
      id: '1'
    });
    expect(out).toMatchObject({
      id: '1',
      contentTypeId: 'mock',
      locale: 'en-US'
    });
  });
  it('lodas data via File API ', async () => {
    const out = await contentLoader.load({
      contentTypeId: 'mock',
      locale: 'en-US',
      id: '1'
    });
    expect(out).toMatchObject({
      id: '1',
      contentTypeId: 'mock',
      locale: 'en-US'
    });
  });
  it('lodas data by id correctly', async () => {
    const out = await contentLoader.load({
      contentTypeId: 'mock',
      locale: 'en-US',
      id: '1'
    });
    expect(out).toMatchObject({
      id: '1',
      contentTypeId: 'mock',
      locale: 'en-US'
    });
  });
  it('lodas data by slug correctly', async () => {
    const out = await contentLoader.load({
      contentTypeId: 'mock',
      locale: 'en-US',
      slug: 'mock'
    });
    expect(out).toMatchObject({
      slug: 'mock',
      contentTypeId: 'mock',
      locale: 'en-US'
    });
  });
  it('lodas many items by ids correctly', async () => {
    const keys = [
      {
        contentTypeId: 'mock',
        locale: 'en-US',
        id: '1'
      },
      {
        contentTypeId: 'mock',
        locale: 'en-US',
        id: '1'
      }
    ];
    const out = await contentLoader.loadMany(keys);
    expect({ out }).toMatchObject({ out: keys });
  });
  it('lodas many items by slugs correctly', async () => {
    const out = await contentLoader.loadMany([
      {
        contentTypeId: 'mock',
        locale: 'en-US',
        slug: 'mock'
      },
      {
        contentTypeId: 'mock',
        locale: 'en-US',
        slug: 'mock'
      }
    ]);
    expect(out).toMatchObject({
      slug: 'mock',
      contentTypeId: 'mock',
      locale: 'en-US'
    });
  });
});
