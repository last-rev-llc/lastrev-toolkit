import Contentful, { Entry, getAllContentItemsForContentType } from '@last-rev/integration-contentful';
import { AdapterConfig } from '@last-rev/adapter-contentful';
import { each, map, has } from 'lodash';
import { join } from 'path';
import { CONTENT_DIR, CONTENT_JSON_DIR } from '../constants';
import writeJsonFile from '../helpers/writeJsonFile';
import mkdirIfNotExists from '../helpers/mkDirIfNotExists';
import { BuildConfig, BuildTask } from '../types';

const isEntry = (obj: Record<string, unknown> | Entry<unknown>): obj is Entry<unknown> =>
  (obj as Entry<unknown>).sys !== undefined;

const fetchContentJsons = async ({
  buildConfig,
  contentTypeId,
  limit = 20,
  include = 10,
  adapterConfig
}: {
  buildConfig: BuildConfig;
  contentTypeId: string;
  limit?: number;
  include?: number;
  adapterConfig: AdapterConfig;
}): Promise<Record<string, Record<string, unknown> | Entry<unknown>>> => {
  const getContent = buildConfig.useAdapter
    ? // eslint-disable-next-line @typescript-eslint/unbound-method
      Contentful(adapterConfig).getAllContentItemsForContentType
    : getAllContentItemsForContentType;

  const results = await getContent({
    contentTypeId,
    include,
    limit
  });

  const out: Record<string, Record<string, unknown> | Entry<unknown>> = {};

  each(results, (result: Record<string, unknown> | Entry<{ slug: string }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const slug: string = isEntry(result) ? result.fields.slug : (result.slug as string);
    out[slug] = result;
  });

  return out;
};

const writeContentJson: BuildTask = async (buildConfig: BuildConfig, { adapterConfig }): Promise<void> => {
  if (!buildConfig || !has(buildConfig, 'contentPrefetch.types')) return;

  const limit = buildConfig.contentPrefetch.pageSize;
  const { include } = buildConfig.contentPrefetch;

  await mkdirIfNotExists(CONTENT_DIR);
  await mkdirIfNotExists(CONTENT_JSON_DIR);

  await Promise.all(
    map(buildConfig.contentPrefetch.types, (contentTypeId) => {
      const toExec = async () => {
        const contentJsons = await fetchContentJsons({
          contentTypeId,
          buildConfig,
          adapterConfig,
          limit,
          include
        });
        const contentTypeDir = join(CONTENT_JSON_DIR, contentTypeId);
        await mkdirIfNotExists(contentTypeDir);

        return Promise.all(
          map(contentJsons, (json, contentId) => {
            return writeJsonFile(join(contentTypeDir, `${contentId}.json`), json);
          })
        );
      };
      return toExec();
    })
  );
};

export default writeContentJson;
