import { createClient } from 'contentful';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';
import getPageBySlugCreator from './getPageBySlug';
import getFullContentByIdCreator from './getFullContentById';
import getStaticSlugsForContentTypeCreator from './getStaticSlugsForContentType';
import getLocalesCreator from './getLocales';
import getLocalizationLookupCreator from './getLocalizationLookup';
import getGlobalSettingsCreator from './getGlobalSettings';
import getContentTypesCreator from './getContentTypes';
import getContentTypeCreator from './getContentType';
import getAllContentItemsForContentTypeCreator from './getAllContentItemsForContentType';
import syncAllEntriesForContentTypeCreator from './syncAllEntriesForContentType';
import syncAllAssetsCreator from './syncAllAssets';
import ContentLoader from './contentLoader';

import {
  GetPageBySlugConfig,
  GetFullContentByIdConfig,
  GetGlobalSettingsConfig,
  GetAllContentItemsByContentTypeConfig
} from './types';

export * from './types';

export const getPageBySlug = (client) => getPageBySlugCreator(client);
export const getFullContentById = (client) => getFullContentByIdCreator(client);
export const getStaticSlugsForContentType = (client) => getStaticSlugsForContentTypeCreator(client);
export const getLocales = (client) => getLocalesCreator(client);
export const getLocalizationLookup = (client) => getLocalizationLookupCreator(client);
export const getGlobalSettings = (client) => getGlobalSettingsCreator(client);
export const getContentTypes = (client) => getContentTypesCreator(client);
export const getContentType = (client) => getContentTypeCreator(client);
export const getAllContentItemsForContentType = (client) => getAllContentItemsForContentTypeCreator(client);
export const syncAllEntriesForContentType = (client) => syncAllEntriesForContentTypeCreator(client);
export const syncAllAssets = (client) => syncAllAssetsCreator(client);

export declare type WrappedContentful = {
  getPageBySlug(getPageBySlugConfig: GetPageBySlugConfig): Promise<Record<string, unknown>>;
  getFullContentById(getFullContentByIdConfig: GetFullContentByIdConfig): Promise<Record<string, unknown>>;
  getGlobalSettings(getGlobalSettingsConfig: GetGlobalSettingsConfig): Promise<Record<string, unknown>>;
  getAllContentItemsForContentType(
    getAllContentItemsByContentTypeConfig: GetAllContentItemsByContentTypeConfig
  ): Promise<Record<string, unknown>>;
  loader: ContentLoader;
};

const Contentful = (config: AdapterConfig): WrappedContentful => {
  const transform = Adapter(config);
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENV || 'master',
    accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
    host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
    ...config.contentful
  });

  return {
    getPageBySlug: async (getPageBySlugConfig: GetPageBySlugConfig) =>
      transform(await getPageBySlug(client)(getPageBySlugConfig)),
    getFullContentById: async (getFullContentByIdConfig: GetFullContentByIdConfig) =>
      transform(await getFullContentById(client)(getFullContentByIdConfig)),
    getGlobalSettings: async (getGlobalSettingsConfig: GetGlobalSettingsConfig) =>
      transform(await getGlobalSettings(client)(getGlobalSettingsConfig)),
    getAllContentItemsForContentType: async (
      getAllContentItemsForContentTypeConfig: GetAllContentItemsByContentTypeConfig
    ) => transform(await getAllContentItemsForContentType(client)(getAllContentItemsForContentTypeConfig)),
    loader: new ContentLoader({
      ...config,
      client,
      syncAllEntriesForContentType
    })
  };
};

export default Contentful;
