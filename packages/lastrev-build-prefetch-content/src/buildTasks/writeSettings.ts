import { map, get } from 'lodash';
import Handlebars from 'handlebars';
import Contentful, { getGlobalSettings, getLocales } from '@last-rev/integration-contentful';
import jsonStringifySafe from 'json-stringify-safe';
import Adapter, { AdapterConfig } from '@last-rev/adapter-contentful';

import writeFile from '../helpers/writeFile';
import { SETTINGS_TEMPLATE } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
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

  if (prefetchedContent) {
    const transform = useAdapter ? Adapter(adapterConfig) : (a) => a;

    const { locales, defaultLocale, contentById, assetsById } = prefetchedContent;
    return map(locales, (locale) => {
      const composed = compose({
        contentId: process.env.CONTENTFUL_SETTINGS_ID,
        contentById,
        include: buildConfig.settingsInclude,
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
  }

  const getSettings = useAdapter ? Contentful(adapterConfig).getGlobalSettings : getGlobalSettings;

  const locales = await getLocales();

  const promises = locales.map((locale) => {
    return (async (): Promise<LocalizedSettingsData> => {
      const settings = await getSettings({
        include: get(buildConfig, 'settingsInclude'),
        locale: locale.code,
        contentTypeId: get(buildConfig, 'settingsContentType')
      });
      return {
        locale: locale.code,
        isDefault: locale.default,
        settingsJson: JSON.stringify(settings, null, 2)
      };
    })();
  });

  const localeSettings = await Promise.all(promises);

  return localeSettings;
};

const writeSettings: BuildTask = async (buildConfig, prefetchedContent, { adapterConfig }): Promise<void> => {
  const { outputDirectory, settingsFile } = buildConfig;

  await mkdirIfNotExists(outputDirectory);

  const localeSettings = await loadSettings(buildConfig, adapterConfig, prefetchedContent);

  await writeSettingsJs(settingsFile, localeSettings);
};

export default writeSettings;
