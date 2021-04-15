import { AdapterConfig, ContentUrlLookup } from '@last-rev/adapter-contentful';
import { Asset, Entry, ContentType } from 'contentful';
import { RulesLogic } from 'json-logic-js';

export type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

export type LocalizationLookupType = 'JSON' | 'Content';

export type LocalesConfig = {
  localizationLookupFieldName?: string;
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

export type ContentJsonConfig = {
  [pageContentType: string]: {
    include: number;
    slugField?: string;
    rootOmitFields?: string[];
    childOmitFields?: string[];
  };
};

export type WebsiteSectionPathsConfig = {
  pageContentTypes: string[];
};

export type NestedParentPathItemConfig = {
  fieldName: string;
  paramName?: string;
  maxDepth?: number;
  parentField?: string;
  root?: string;
  rootDomainFile?: string;
}

export type NestedParentPathsConfig = {
  [contentTypeId: string]: NestedParentPathItemConfig
};

export type FileLocationsBuildConfig = {
  outputDirectory: string;
  adapterConfigFile: string;
  contentJsonDirectory: string;
  i18nFile: string;
  mappingFile: string;
  pathsFile: string;
  settingsFile: string;
  untranslatedPagesDirectory: string;
  translatedPagesDirectory: string;
  localesOutputDirectory: string;
};

export type SwitchesBuildConfig = {
  useAdapter: boolean;
  writeSettings: boolean;
  writePaths: boolean;
  writeMappings: boolean;
  writeAdapterConfig: boolean;
  writeLocaleData: boolean;
  writeContentJson: boolean;
};

export type NestedChildPathsConfig = Record<string, SimplePathConfig | ComplexPathConfig>;

export type PathsConfig = {
  type?:
    | 'Nested Parent'
    /**
     * @deprecated
     */
    | 'Nested Children'
    /**
     * @deprecated
     */
    | 'Website Sections';
  config: NestedChildPathsConfig | WebsiteSectionPathsConfig | NestedParentPathsConfig;
};

export type SettingsConfig = {
  include?: number;
};

export type ExcludePagesConfig = {
  [contentTypeId: string]: {
    excludeIfParentExcluded: boolean;
    fields: string[];
    rules: RulesLogic;
  };
};

type OptionsBuildConfig = {
  excludeTypes: string[];
  mappings: MappingConfig;
  paths: PathsConfig;
  contentJson: ContentJsonConfig;
  settings: SettingsConfig;
  locales: LocalesConfig;
  excludePages: ExcludePagesConfig;
};

export type BuildConfig = Partial<OptionsBuildConfig> &
  Partial<SwitchesBuildConfig> &
  Partial<FileLocationsBuildConfig>;

export type ResolvedBuildConfig = OptionsBuildConfig & SwitchesBuildConfig & FileLocationsBuildConfig;

export type BuildTask = (
  buildConfig: ResolvedBuildConfig,
  preloadedContent: PreloadedContentfulContent,
  other?: {
    adapterConfig: AdapterConfig;
  }
) => Promise<void>;

export type LastRevRc = {
  build?: BuildConfig;
  adapter?: AdapterConfig;
};

export type PathsOutput = {
  [contentTypeId: string]: {
    params: {
      [paramName: string]: string[];
    };
  }[];
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
  contentUrlLookup: ContentUrlLookup;
  pathsByContentType: PathsOutput;
};

export type RootLogicFunc = (entry: any) => string | null;