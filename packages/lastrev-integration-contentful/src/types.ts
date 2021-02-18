import { Entry, EntryCollection } from 'contentful';

export { Entry } from 'contentful';

export type SafeEntryCollection = {
  items: Record<string, unknown>[];
};

export type GetPageBySlugConfig = {
  slug: string;
  contentTypeId: string;
  locale?: string;
  include?: number;
  slugFieldName?: string;
  omitFields: string[];
};

export type GetFullContentByIdConfig = {
  contentTypeId: string;
  id: string;
  locale?: string;
  include: number;
  omitFields: string[];
};

export type GetGlobalSettingsConfig = {
  locale?: string;
  include?: number;
  contentTypeId?: string;
};

export type GetAllContentItemsByContentTypeConfig = {
  contentTypeId: string;
  fields?: string[];
  order?: string;
  nestedFieldName?: string;
  include?: number;
  omitFields: string[];
};

export type SyncAllEntriesAndAssetsConfig = {
  contentTypeId: string;
};

export type LocalizationLookupMapping = Record<string, any>;

export type StaticSlugResult = string | [string, Entry<unknown>[]];
