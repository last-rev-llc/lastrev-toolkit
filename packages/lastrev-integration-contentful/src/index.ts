import { createClient } from 'contentful';
import Adapter, { AdapterConfig, TransformResult } from '@last-rev/adapter-contentful';
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
import getEntriesCreator from './getEntries';

import {
  GetPageBySlugConfig,
  GetFullContentByIdConfig,
  GetGlobalSettingsConfig,
  GetAllContentItemsByContentTypeConfig,
  GetEntriesConfig,
  getEntriesResult
} from './types';

export * from './types';

const space = process.env.CONTENTFUL_SPACE_ID;

if (!space) {
  throw Error(`required environment variable: "CONTENTFUL_SPACE_ID" is missing. Please update your environment.`);
}

const accessToken = process.env.CONTENTFUL_ACCESSTOKEN;

if (!accessToken) {
  throw Error(`required environment variable: "CONTENTFUL_ACCESSTOKEN" is missing. Please update your environment.`);
}

const client = createClient({
  space,
  environment: process.env.CONTENTFUL_ENV || 'master',
  accessToken,
  host: process.env.CONTENTFUL_HOST || 'preview.contentful.com'
});

export const getPageBySlug = getPageBySlugCreator(client);
export const getFullContentById = getFullContentByIdCreator(client);
export const getStaticSlugsForContentType = getStaticSlugsForContentTypeCreator(client);
export const getLocales = getLocalesCreator(client);
export const getLocalizationLookup = getLocalizationLookupCreator(client);
export const getGlobalSettings = getGlobalSettingsCreator(client);
export const getContentTypes = getContentTypesCreator(client);
export const getContentType = getContentTypeCreator(client);
export const getAllContentItemsForContentType = getAllContentItemsForContentTypeCreator(client);
export const syncAllEntriesForContentType = syncAllEntriesForContentTypeCreator(client);
export const syncAllAssets = syncAllAssetsCreator(client);
export const getEntries = getEntriesCreator(client);

export declare type WrappedContentful = {
  getPageBySlug(getPageBySlugConfig: GetPageBySlugConfig): Promise<TransformResult<unknown>>;
  getFullContentById(getFullContentByIdConfig: GetFullContentByIdConfig): Promise<TransformResult<unknown>>;
  getGlobalSettings(getGlobalSettingsConfig: GetGlobalSettingsConfig): Promise<TransformResult<unknown>>;
  getAllContentItemsForContentType(
    getAllContentItemsByContentTypeConfig: GetAllContentItemsByContentTypeConfig
  ): Promise<TransformResult<unknown[]>>;
  getEntries(getEntriesConfig: GetEntriesConfig): Promise<{ total: number; items: TransformResult<unknown[]> }>;
};

const Contentful = (config: AdapterConfig): WrappedContentful => {
  const transform = Adapter(config);
  return {
    getPageBySlug: async (getPageBySlugConfig: GetPageBySlugConfig) =>
      transform(await getPageBySlug(getPageBySlugConfig)),
    getFullContentById: async (getFullContentByIdConfig: GetFullContentByIdConfig) =>
      transform(await getFullContentById(getFullContentByIdConfig)),
    getGlobalSettings: async (getGlobalSettingsConfig: GetGlobalSettingsConfig) =>
      transform(await getGlobalSettings(getGlobalSettingsConfig)),
    getAllContentItemsForContentType: async (
      getAllContentItemsForContentTypeConfig: GetAllContentItemsByContentTypeConfig
    ) => transform((await getAllContentItemsForContentType(getAllContentItemsForContentTypeConfig)) as any[]),
    getEntries: async (getEntriesConfig: GetEntriesConfig) => {
      const { total, items } = await getEntries(getEntriesConfig);
      return { total, items: transform(items) };
    }
  };
};

export default Contentful;
