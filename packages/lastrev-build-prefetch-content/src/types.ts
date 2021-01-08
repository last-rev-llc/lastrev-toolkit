export type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

export type LocalesConfig = {
  localizationLookupFieldName?: string;
  rawPagesDir?: string;
  outputPath?: string;
  useV1?: boolean;
};

export type PathChildrenConfig = {
  param: string;
  fieldName: string;
  children?: PathChildrenConfig;
};

export type SimplePathConfig = string;

export type ComplexPathConfig = {
  param: string;
  contentType: string;
  children?: PathChildrenConfig;
};

export type ContentPrefetchConfig = Record<
  string,
  {
    include: number;
    slugField?: string;
    rootOmitFields?: string[];
    childOmitFields?: string[];
  }
>;

export type WebsiteSectionPathsConfig = {
  pageContentTypes: string[];
};

export type BuildConfig = {
  useAdapter?: boolean;
  mappings?: MappingConfig;
  paths?: Record<string, SimplePathConfig | ComplexPathConfig>;
  websiteSectionPathsConfig: WebsiteSectionPathsConfig;
  useWebsiteSectionPaths?: boolean;
  contentPrefetch?: ContentPrefetchConfig;
  settingsInclude?: number;
  locales?: LocalesConfig;
  settingsContentType?: string;
  writeSettings?: boolean;
  writePaths?: boolean;
  writeMappings?: boolean;
  writeAdapterConfig?: boolean;
  writeLocaleData?: boolean;
  writeContentJson?: boolean;
};

export type BuildTask = (buildConfig: BuildConfig, other: Record<string, unknown>) => Promise<void>;
