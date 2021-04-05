import { map } from 'lodash';
import Handlebars from 'handlebars';
import jsonStringifySafe from 'json-stringify-safe';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';

import writeFile from '../helpers/writeFile';
import { SETTINGS_TEMPLATE } from '../constants';
import { BuildTask, PreloadedContentfulContent, ResolvedBuildConfig } from '../types';

import compose from '../helpers/compose';

type LocalizedSettingsData = {
  locale: string;
  isDefault: boolean;
  settingsJson: string;
};

const writeSettingsJs = async (settingsFile: string, settingsByLocale: LocalizedSettingsData[]) => {
  const out = Handlebars.compile(SETTINGS_TEMPLATE)({ settingsByLocale });
  await writeFile(settingsFile, out);
};

const loadSettings = async (
  buildConfig: ResolvedBuildConfig,
  adapterConfig: AdapterConfig,
  prefetchedContent: PreloadedContentfulContent
) => {
  const useAdapter = { buildConfig };

  const { locales, contentUrlLookup, defaultLocale, contentById, assetsById } = prefetchedContent;

  const transform = useAdapter ? Adapter({ ...adapterConfig, contentUrlLookup }) : (a) => a;

  return map(locales, (locale) => {
    const composed = compose({
      contentId: process.env.CONTENTFUL_SETTINGS_ID,
      contentById,
      include: buildConfig.settings.include,
      assetsById,
      defaultLocale,
      locale,
      rootOmitFields: [],
      childOmitFields: []
    });

    const settings = transform(JSON.parse(jsonStringifySafe(composed)));
    return {
      locale,
      isDefault: locale === defaultLocale,
      settingsJson: JSON.stringify(settings, null, 2)
    };
  });
};

const writeSettings: BuildTask = async (buildConfig, prefetchedContent, { adapterConfig }): Promise<void> => {
  const settingsId = process.env.CONTENTFUL_SETTINGS_ID;

  if (!settingsId) {
    throw Error(`required environment variable: "CONTENTFUL_SETTINGS_ID" is missing. Please update your environment.`);
  }

  const { settingsFile } = buildConfig;

  const localeSettings = await loadSettings(buildConfig, adapterConfig, prefetchedContent);

  await writeSettingsJs(settingsFile, localeSettings);
};

export default writeSettings;
