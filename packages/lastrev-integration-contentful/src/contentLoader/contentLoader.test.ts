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

describe('Content Loader with FileCache', () => {
  let contentLoader;
  let keyId;
  let keySlug;
  beforeEach(() => {
    jest.setTimeout(30000);
    keyId = {
      locale: 'en-US',
      contentTypeId: 'categoryPostTag',
      id: '287730029'
    };
    keySlug = {
      locale: 'en-US',
      contentTypeId: 'categoryPostTag',
      slug: 'entrepreneurial-ecosystem'
    };
    contentLoader = new ContentLoader({
      client,
      urlMap,
      linkContentType: 'uieCta',
      manualEntryTypeText: 'Manual URL',
      modalActionText: 'Open a modal',
      contentRefTypeText: 'ContentReference',
      skipContentTypes: ['skipThisType'],
      contentJsonDirectory: './mock/contentJson',
      syncAllEntriesForContentType: syncAllEntriesForContentTypeCreator(client)
    });
  });

  it('loads data by id ', async () => {
    const out = await contentLoader.load(keyId);
    expect(out).toMatchObject(keyId);
  });

  it('loads data by slug correctly', async () => {
    const out = await contentLoader.load(keySlug);
    expect(out).toMatchObject(keySlug);
  });

  it('loads many items by ids correctly', async () => {
    const keys = [keyId, keyId];
    const out = await contentLoader.loadMany(keys);
    expect({ out }).toMatchObject({ out: keys });
  });
  it('loads many items by slugs correctly', async () => {
    const keys = [keySlug, keySlug];
    const out = await contentLoader.loadMany(keys);
    expect(out).toMatchObject(keys);
  });
});

describe('Content Loader with FetchAPI', () => {
  let contentLoader;
  let keyId;
  let keySlug;
  beforeEach(() => {
    jest.setTimeout(30000);
    keyId = {
      locale: 'en-US',
      contentTypeId: 'categoryPostTag',
      id: '287730029'
    };
    keySlug = {
      locale: 'en-US',
      contentTypeId: 'categoryPostTag',
      slug: 'entrepreneurial-ecosystem'
    };
    contentLoader = new ContentLoader({
      client,
      disableFileCache: true,
      urlMap,
      linkContentType: 'uieCta',
      manualEntryTypeText: 'Manual URL',
      modalActionText: 'Open a modal',
      contentRefTypeText: 'ContentReference',
      skipContentTypes: ['skipThisType'],
      syncAllEntriesForContentType: syncAllEntriesForContentTypeCreator(client)
    });
  });

  it('loads data by id ', async () => {
    const out = await contentLoader.load(keyId);
    expect(out).toMatchObject(keyId);
  });

  it('loads data by slug correctly', async () => {
    const out = await contentLoader.load(keySlug);
    expect(out).toMatchObject(keySlug);
  });

  it('loads many items by ids correctly', async () => {
    const keys = [keyId, keyId];
    const out = await contentLoader.loadMany(keys);
    expect({ out }).toMatchObject({ out: keys });
  });
  it('loads many items by slugs correctly', async () => {
    const keys = [keySlug, keySlug];
    const out = await contentLoader.loadMany(keys);
    expect(out).toMatchObject(keys);
  });
});

describe('Content Loader with Sync API', () => {
  let contentLoader;
  let keyId;
  let keySlug;
  beforeEach(() => {
    jest.setTimeout(30000);
    keyId = {
      locale: 'en-US',
      contentTypeId: 'categoryPostTag',
      id: '287730029'
    };
    keySlug = {
      locale: 'en-US',
      contentTypeId: 'categoryPostTag',
      slug: 'entrepreneurial-ecosystem'
    };
    contentLoader = new ContentLoader({
      client,
      urlMap,
      mode: 'SYNC',
      disableFileCache: true,
      linkContentType: 'uieCta',
      manualEntryTypeText: 'Manual URL',
      modalActionText: 'Open a modal',
      contentRefTypeText: 'ContentReference',
      skipContentTypes: ['skipThisType'],
      syncAllEntriesForContentType: syncAllEntriesForContentTypeCreator(client)
    });
  });

  it('loads data by id ', async () => {
    const out = await contentLoader.load(keyId);
    expect(out).toMatchObject(keyId);
  });

  it('loads data by slug correctly', async () => {
    const out = await contentLoader.load(keySlug);
    expect(out).toMatchObject(keySlug);
  });

  it('loads many items by ids correctly', async () => {
    const keys = [keyId, keyId];
    const out = await contentLoader.loadMany(keys);
    expect({ out }).toMatchObject({ out: keys });
  });
  it('loads many items by slugs correctly', async () => {
    const keys = [keySlug, keySlug];
    const out = await contentLoader.loadMany(keys);
    expect(out).toMatchObject(keys);
  });
});
