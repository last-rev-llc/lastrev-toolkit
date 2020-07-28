import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import findProjectRoot from './helpers/findProjectRoot';

export const PROJECT_ROOT = findProjectRoot();
export const CONTENT_DIR = resolve(PROJECT_ROOT, './src/buildArtifacts');
export const MAPPING_TEMPLATE_FILE = resolve(__dirname, '../templates/mapping.js.hbs');
export const SETTINGS_TEMPLATE_FILE = resolve(__dirname, '../templates/settings.js.hbs');
export const COMPONENTS_DIR = resolve(PROJECT_ROOT, './src/components');
export const PATHS_FILE = join(CONTENT_DIR, 'paths.js');
export const SETTINGS_FILE = join(CONTENT_DIR, 'settings.js');
export const COMPONENT_MAPPING_FILE = join(CONTENT_DIR, 'mapping.js');
export const ADAPTER_CONFIG_FILE = join(CONTENT_DIR, 'adapterConfig.js');
export const MAPPING_TEMPLATE = readFileSync(MAPPING_TEMPLATE_FILE, 'utf-8');
export const SETTINGS_TEMPLATE = readFileSync(SETTINGS_TEMPLATE_FILE, 'utf-8');
export const I18N_JSON_FILE = resolve(PROJECT_ROOT, './i18n.json');
export const DEFAULT_LOCALIZATION_LOOKUP_FIELD_NAME = 'localizationLookup';
export const DEFAULT_RAW_PAGES_DIR = 'src/_pages';
export const DEFAULT_LOCALES_OUTPUT_PATH = 'locales';
