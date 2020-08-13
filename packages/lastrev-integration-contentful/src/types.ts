import { Entry } from 'contentful';

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
};

export type GetFullContentByIdConfig = {
  contentTypeId: string;
  id: string;
  locale?: string;
  include: number;
};

export type GetGlobalSettingsConfig = {
  locale?: string;
  include?: number;
  contentTypeId?: string;
};

export type LocalizationLookupMapping = Record<string, Record<string, string>>;

export type StaticSlugResult = string | [string, Entry<unknown>[]];
