export type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

export type LocalesConfig = {
  localizationLookupFieldName?: string;
  /**
   * @deprecated
   */
  rawPagesDir?: string;
  /**
   * @deprecated
   */
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

export type FileLocationsBuildConfig = {
  outputDirectory: string;
  adapterConfigFile: string;
  contentJsonDirectory: string;
  i18nFile: string;
  componentsDirectory: string;
  mappingFile: string;
  pathsFile: string;
  settingsFile: string;
  untranslatedPagesDirectory: string;
  translatedPagesDirectory: string;
  localesOutputDirectory: string;
};

export type SwitchesBuildConfig = {
  useAdapter: boolean;
  useWebsiteSectionPaths: boolean;
  writeSettings: boolean;
  writePaths: boolean;
  writeMappings: boolean;
  writeAdapterConfig: boolean;
  writeLocaleData: boolean;
  writeContentJson: boolean;
};

type OptionsBuildConfig = {
  mappings?: MappingConfig;
  paths?: Record<string, SimplePathConfig | ComplexPathConfig>;
  websiteSectionPathsConfig?: WebsiteSectionPathsConfig;
  useWebsiteSectionPaths?: boolean;
  contentPrefetch?: ContentPrefetchConfig;
  settingsInclude?: number;
  locales?: LocalesConfig;
  settingsContentType?: string;
};

export type BuildConfig = OptionsBuildConfig & Partial<SwitchesBuildConfig> & Partial<FileLocationsBuildConfig>;

export type ResolvedBuildConfig = OptionsBuildConfig & SwitchesBuildConfig & FileLocationsBuildConfig;

export type BuildTask = (buildConfig: ResolvedBuildConfig, other: Record<string, unknown>) => Promise<void>;
