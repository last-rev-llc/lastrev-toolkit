export type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

export type LocalesConfig = {
  localizationLookupFieldName?: string;
  rawPagesDir?: string;
  outputPath?: string;
};

export type BuildConfig = {
  useAdapter?: boolean;
  mappings?: MappingConfig;
  paths?: Record<string, string>;
  settingsInclude?: number;
  locales?: LocalesConfig;
  settingsContentType?: string;
  writeSettings?: boolean;
  writePaths?: boolean;
  writeMappings?: boolean;
  writeAdapterConfig?: boolean;
  writeLocaleData?: boolean;
};

export type BuildTask = (buildConfig: BuildConfig, other: Record<string, unknown>) => Promise<void>;

export type TypeSlugsTuple = [string, string[]];
