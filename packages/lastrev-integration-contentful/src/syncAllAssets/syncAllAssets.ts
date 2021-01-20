import { ContentfulClientApi, SyncCollection } from 'contentful';

const syncAllAssets = (client: ContentfulClientApi) => async <T>(): Promise<SyncCollection> => {
  return client.sync({
    initial: true,
    resolveLinks: false,
    type: 'Asset'
  });
};
export default syncAllAssets;
