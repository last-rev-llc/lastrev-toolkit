import _ from 'lodash';
import Handlebars from 'handlebars';
import Contentful, { getGlobalSettings, getLocales } from '@last-rev/integration-contentful';

import writeFile from '../helpers/writeFile';
import { CONTENT_DIR, SETTINGS_FILE, SETTINGS_TEMPLATE } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildTask } from '../types';

type LocalizedSettingsData = {
  locale: string;
  isDefault: boolean;
  settingsJson: string;
};

const writeSettingsJs = async (settingsByLocale: LocalizedSettingsData[]) => {
  const out = Handlebars.compile(SETTINGS_TEMPLATE)({ settingsByLocale });
  await writeFile(SETTINGS_FILE, out);
};

const writeSettings: BuildTask = async (buildConfig, { adapterConfig }): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const getSettings = buildConfig.useAdapter ? Contentful(adapterConfig).getGlobalSettings : getGlobalSettings;

  await mkdirIfNotExists(CONTENT_DIR);

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

  await writeSettingsJs(localeSettings);
};

export default writeSettings;
