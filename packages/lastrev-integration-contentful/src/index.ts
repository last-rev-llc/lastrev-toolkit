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
import {
  GetPageBySlugConfig,
  GetFullContentByIdConfig,
  GetGlobalSettingsConfig,
  GetAllContentItemsByContentTypeConfig
} from './types';

export * from './types';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENV || 'master',
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
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

export declare type WrappedContentful = {
  getPageBySlug(getPageBySlugConfig: GetPageBySlugConfig): Promise<Record<string, unknown>>;
  getFullContentById(getFullContentByIdConfig: GetFullContentByIdConfig): Promise<Record<string, unknown>>;
  getGlobalSettings(getGlobalSettingsConfig: GetGlobalSettingsConfig): Promise<Record<string, unknown>>;
  getAllContentItemsForContentType(
    getAllContentItemsByContentTypeConfig: GetAllContentItemsByContentTypeConfig
  ): Promise<Record<string, unknown>>;
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
    ) => transform(await getAllContentItemsForContentType(getAllContentItemsForContentTypeConfig))
  };
};

export default Contentful;
