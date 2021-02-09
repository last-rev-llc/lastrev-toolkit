import _ from 'lodash';
import Handlebars from 'handlebars';
import Contentful, { getGlobalSettings, getLocales } from '@last-rev/integration-contentful';

import writeFile from '../helpers/writeFile';
import { SETTINGS_TEMPLATE } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildTask } from '../types';

type LocalizedSettingsData = {
  locale: string;
  isDefault: boolean;
  settingsJson: string;
};

const writeSettingsJs = async (settingsFile: string, settingsByLocale: LocalizedSettingsData[]) => {
  const out = Handlebars.compile(SETTINGS_TEMPLATE)({ settingsByLocale });
  await writeFile(settingsFile, out);
};

const writeSettings: BuildTask = async (buildConfig, { adapterConfig }): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const getSettings = buildConfig.useAdapter ? Contentful(adapterConfig).getGlobalSettings : getGlobalSettings;

  const { outputDirectory, settingsFile } = buildConfig;

  await mkdirIfNotExists(outputDirectory);

  const locales = await getLocales();

  const promises = locales.map((locale) => {
    return (async (): Promise<LocalizedSettingsData> => {
      const settings = await getSettings({
        include: _.get(buildConfig, 'settingsInclude'),
        locale: locale.code,
        contentTypeId: _.get(buildConfig, 'settingsContentType')
      });
      return {
        locale: locale.code,
        isDefault: locale.default,
        settingsJson: JSON.stringify(settings, null, 2)
      };
    })();
  });

  const localeSettings = await Promise.all(promises);

  await writeSettingsJs(settingsFile, localeSettings);
};

export default writeSettings;
