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

export type Asset = {
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
    };
  };
};

export type UrlMap = Record<
  string,
  {
    url: string;
    key: string;
  }
>;

export type ParsedEntry = {
  _id: string;
  _contentTypeId: string;
  _href?: string;
  _as?: string;
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
};

export type Transform = (data: any) => Record<string, unknown>;
