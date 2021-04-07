import { createClient } from 'contentful';
import syncAllEntriesForContentTypeCreator from '../syncAllEntriesForContentType';
import ContentLoader from './contentLoader';
require('dotenv').config();
const urlMap = {
  pageGeneral: {
    url: '/[key]',
    key: 'slug'
  }
};

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENV || 'master',
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
  host: process.env.CONTENTFUL_HOST || 'preview.contentful.com'
});

describe('Content Loader', () => {
  let contentful;
  let contentLoader;
  beforeEach(() => {
    jest.setTimeout(30000);
    contentLoader = new ContentLoader({
      client,
      urlMap,
      // useFileCache: true,
      // useSyncAPI: true,
      linkContentType: 'uieCta',
      manualEntryTypeText: 'Manual URL',
      modalActionText: 'Open a modal',
      contentRefTypeText: 'ContentReference',
      skipContentTypes: ['skipThisType'],
      syncAllEntriesForContentType: syncAllEntriesForContentTypeCreator(client)
    });
  });

  it('loads data via Fetch API ', async () => {
    const out = await contentLoader.load({
      contentTypeId: 'categoryPostTag',
      locale: 'en-US',
      id: '287730029'
    });
    expect(out).toMatchObject({
      contentTypeId: 'categoryPostTag',
      locale: 'en-US',
      id: '287730029'
    });
  });
  // it('loads data via Preview API ', async () => {
  //   const out = await contentLoader.load({
  //     contentTypeId: 'mock',
  //     locale: 'en-US',
  //     id: '1'
  //   });
  //   expect(out).toMatchObject({
  //     id: '1',
  //     contentTypeId: 'mock',
  //     locale: 'en-US'
  //   });
  // });
  // it('loads data via File API ', async () => {
  //   const out = await contentLoader.load({
  //     contentTypeId: 'mock',
  //     locale: 'en-US',
  //     id: '1'
  //   });
  //   expect(out).toMatchObject({
  //     id: '1',
  //     contentTypeId: 'mock',
  //     locale: 'en-US'
  //   });
  // });
  // it('loads data by id correctly', async () => {
  //   const out = await contentLoader.load({
  //     contentTypeId: 'mock',
  //     locale: 'en-US',
  //     id: '1'
  //   });
  //   expect(out).toMatchObject({
  //     id: '1',
  //     contentTypeId: 'mock',
  //     locale: 'en-US'
  //   });
  // });
  // it('loads data by slug correctly', async () => {
  //   const out = await contentLoader.load({
  //     contentTypeId: 'mock',
  //     locale: 'en-US',
  //     slug: 'mock'
  //   });
  //   expect(out).toMatchObject({
  //     slug: 'mock',
  //     contentTypeId: 'mock',
  //     locale: 'en-US'
  //   });
  // });
  // it('loads many items by ids correctly', async () => {
  //   const keys = [
  //     {
  //       contentTypeId: 'mock',
  //       locale: 'en-US',
  //       id: '1'
  //     },
  //     {
  //       contentTypeId: 'mock',
  //       locale: 'en-US',
  //       id: '1'
  //     }
  //   ];
  //   const out = await contentLoader.loadMany(keys);
  //   expect({ out }).toMatchObject({ out: keys });
  // });
  // it('loads many items by slugs correctly', async () => {
  //   const out = await contentLoader.loadMany([
  //     {
  //       contentTypeId: 'mock',
  //       locale: 'en-US',
  //       slug: 'mock'
  //     },
  //     {
  //       contentTypeId: 'mock',
  //       locale: 'en-US',
  //       slug: 'mock'
  //     }
  //   ]);
  //   expect(out).toMatchObject({
  //     slug: 'mock',
  //     contentTypeId: 'mock',
  //     locale: 'en-US'
  //   });
  // });
});
