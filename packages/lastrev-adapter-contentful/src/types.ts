import { Asset } from 'contentful';

export type LinkTextTypes = {
  newWindowActionText: string;
  modalActionText: string;
  downloadActionText: string;
  manualEntryTypeText: string;
  contentRefTypeText: string;
  assetRefTypeText: string;
};

export type Entry<T> = {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: T;
};

export type UrlMapping = {
  url: string;
  key: string;
};

export type UrlMap = Record<string, UrlMapping>;

export type ParsedEntry = {
  _id: string;
  _contentTypeId: string;
  _href?: string;
  _as?: string;
};

export type ParsedAsset = {
  title: string;
  description?: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  filename?: string;
  contentType: string;
};

export type ContentUrlLookup = {
  [contentId: string]: {
    href?: string;
    as?: string;
  };
};

export type AdapterConfig = {
  urlMap?: Record<
    string,
    {
      url: string;
      key: string;
    }
  >;
  linkContentType?: string;
  sameWindowActionText?: string;
  newWindowActionText?: string;
  modalActionText?: string;
  downloadActionText?: string;
  manualEntryTypeText?: string;
  contentRefTypeText?: string;
  assetRefTypeText?: string;
  contentUrlLookup?: ContentUrlLookup;
  skipContentTypes?: string[];
};

export type CircularReference = {
  sys: {
    type: 'Link';
    linkType: 'Entry';
    id: string;
    circular: true;
  };
};

export type LinkFields = {
  action: string;
  destinationType: string;
  linkText?: string;
  manualUrl?: string;
  contentReference?: Entry<{ slug: string }> | CircularReference;
  assetReference?: Asset;
};

export type TransformResult<T> = T extends any[] ? Record<string, unknown>[] : Record<string, unknown>[];

export type Transform = (data: any | any[]) => TransformResult<typeof data>;
