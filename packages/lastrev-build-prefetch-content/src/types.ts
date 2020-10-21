export type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

export type LocalesConfig = {
  localizationLookupFieldName?: string;
  rawPagesDir?: string;
  outputPath?: string;
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

export type BuildConfig = {
  useAdapter?: boolean;
  mappings?: MappingConfig;
  paths?: Record<string, SimplePathConfig | ComplexPathConfig>;
  settingsInclude?: number;
  locales?: LocalesConfig;
  settingsContentType?: string;
  writeSettings?: boolean;
  writePaths?: boolean;
  writeMappings?: boolean;
  writeAdapterConfig?: boolean;
  writeLocaleData?: boolean;
  writeRedirects?: boolean;
};

export type BuildTask = (buildConfig: BuildConfig, other: Record<string, unknown>) => Promise<void>;
