import { readFileSync } from 'fs';
import { resolve } from 'path';
import findProjectRoot from './helpers/findProjectRoot';
import { LocalizationLookupType } from './types';

export const PROJECT_ROOT = findProjectRoot();

// internal
export const MAPPING_TEMPLATE_FILE = resolve(__dirname, '../templates/mapping.js.hbs');
export const SETTINGS_TEMPLATE_FILE = resolve(__dirname, '../templates/settings.js.hbs');
export const MAPPING_TEMPLATE = readFileSync(MAPPING_TEMPLATE_FILE, 'utf-8');
export const SETTINGS_TEMPLATE = readFileSync(SETTINGS_TEMPLATE_FILE, 'utf-8');

// defaults
export const DEFAULT_OUTPUT_DIRNAME = 'src/buildArtifacts';
export const DEFAULT_COMPONENTS_DIRNAME = 'src/components';
export const DEFAULT_PATHS_FILENAME = 'paths.js';
export const DEFAULT_MAPPING_FILENAME = 'mapping.js';
export const DEFAULT_CONTENT_JSON_DIRNAME = 'contentJson';
export const DEFAULT_SETTINGS_FILENAME = 'settings.js';
export const DEFAULT_ADAPTER_CONFIG_FILENAME = 'adapterConfig.js';
export const DEFAULT_I18N_FILENAME = 'i18n.json';
export const DEFAULT_LOCALIZATION_LOOKUP_FIELD_NAME = 'localizationLookup';
export const DEFAULT_LOCALES_OUTPUT_DIRNAME = 'locales';
export const DEFAULT_UNTRANSLATED_PAGES_DIRNAME = 'src/_pages';
export const DEFAULT_TRANSLATED_PAGES_DIRNAME = 'src/pages';
export const DEFAULT_SLUG_FIELD = 'slug';
export const DEFAULT_LOCALES_LOOKUP_TYPE: LocalizationLookupType = 'JSON';
export const DEFAULT_LOCALIZATION_ITEM_CONTENT_TYPE = 'localizedStaticContentItem';
export const DEFAULT_LOCALIZATION_SET_CONTENT_TYPE = 'localizedStaticContentSet';
export const DEFAULT_NESTED_PATHS_MAX_DEPTH = 10;
