import { AdapterConfig } from '@last-rev/adapter-contentful';
import { Asset, Entry, ContentType } from 'contentful';

export type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

export type LocalizationLookupType = 'JSON' | 'Content';

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
  lookupType?: LocalizationLookupType;
  localizationItemContentTypeId?: string;
  localizationSetContentTypeId?: string;
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

export type NestedPathsConfig = {
  [contentTypeId: string]: {
    fieldName: string;
    maxDepth?: number;
    parentField?: string;
  };
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
  writeNestedPaths: boolean;
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
  nestedPaths?: NestedPathsConfig;
};

export type BuildConfig = OptionsBuildConfig & Partial<SwitchesBuildConfig> & Partial<FileLocationsBuildConfig>;

export type ResolvedBuildConfig = OptionsBuildConfig & SwitchesBuildConfig & FileLocationsBuildConfig;

export type BuildTask = (
  buildConfig: ResolvedBuildConfig,
  preloadedContent?: PreloadedContentfulContent,
  other?: any
) => Promise<void>;

export type LastRevRc = {
  build?: BuildConfig;
  adapter?: AdapterConfig;
};

export type PreloadedContentfulContent = {
  assetsById: {
    [id: string]: Asset;
  };
  defaultLocale: string;
  locales: string[];
  contentTypes: ContentType[];
  contentById: {
    [id: string]: Entry<any>;
  };
  slugToIdByContentType: {
    [contentTypId: string]: {
      [slug: string]: string;
    };
  };
};
