/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import _ from 'lodash';
import Contentful, { getGlobalSettings } from '@last-rev/integration-contentful';

import writeFile from '../helpers/writeFile';
import { CONTENT_DIR, REDIRECTS_FILE } from '../constants';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildTask } from '../types';

type Redirect = {
  from: string;
  to: string;
  status?: number;
  force?: boolean;
};

const writeRedirectFile = async (redirects: string): Promise<void> => {
  await writeFile(REDIRECTS_FILE, redirects);
};

const writeRedirects: BuildTask = async (buildConfig, { adapterConfig }): Promise<void> => {
  const getSettings = buildConfig.useAdapter ? Contentful(adapterConfig).getGlobalSettings : getGlobalSettings;

  await mkdirIfNotExists(CONTENT_DIR);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localeSettings: any = await getSettings({
    include: _.get(buildConfig, 'settingsInclude'),
    contentTypeId: _.get(buildConfig, 'settingsContentType')
  });

  const { redirects }: { redirects: Array<Redirect> } = localeSettings;

  const result: Array<string> = [];

  if (_.isArray(redirects)) {
    _.each(redirects, (redirect: Redirect) => {
      let record = `${redirect.from} ${redirect.to}`;
      if (redirect.status) record = `${record} ${redirect.status}`;
      if (redirect.status && redirect.force) record = `${record}!`;
      result.push(record);
    });
  }

  await writeRedirectFile(result.join('\n'));
};

export default writeRedirects;
