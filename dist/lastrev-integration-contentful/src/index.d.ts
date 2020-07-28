import { Entry } from 'contentful';
import { AdapterConfig } from '@last-rev/adapter-contentful';
import { GetPageBySlugConfig, GetFullContentByIdConfig, GetGlobalSettingsConfig } from './types';
export * from './types';
export declare const getPageBySlug: <T>({ slug, contentTypeId, locale, include, slugFieldName }: GetPageBySlugConfig) => Promise<Entry<T>>;
export declare const getFullContentById: <T>({ contentTypeId, id, locale, include }: GetFullContentByIdConfig) => Promise<Entry<T>>;
export declare const getStaticSlugsForContentType: ({ contentTypeId, slugFieldName, order }: {
    contentTypeId: string;
    slugFieldName?: string;
    order?: string;
}) => Promise<string[]>;
export declare const getLocales: () => Promise<import("contentful").Locale[]>;
export declare const getLocalizationLookup: ({ localizationLookupFieldName, contentTypeId }: {
    localizationLookupFieldName?: string;
    contentTypeId?: string;
}) => Promise<Record<string, Record<string, string>>>;
export declare const getGlobalSettings: <T>({ locale, include, contentTypeId }: GetGlobalSettingsConfig) => Promise<Entry<T>>;
export declare const getContentTypes: () => Promise<import("contentful").ContentTypeCollection>;
export declare const getContentType: ({ contentTypeId }: {
    contentTypeId: string;
}) => Promise<import("contentful").ContentType>;
export declare type WrappedContentful = {
    getPageBySlug(getPageBySlugConfig: GetPageBySlugConfig): Promise<Record<string, unknown>>;
    getFullContentById(getFullContentByIdConfig: GetFullContentByIdConfig): Promise<Record<string, unknown>>;
    getGlobalSettings(getGlobalSettingsConfig: GetGlobalSettingsConfig): Promise<Record<string, unknown>>;
};
declare const Contentful: (config: AdapterConfig) => WrappedContentful;
export default Contentful;
//# sourceMappingURL=index.d.ts.map