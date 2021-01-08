import { ContentfulClientApi, SyncCollection } from 'contentful';

const syncAllEntriesForContentType = (client: ContentfulClientApi) => async <T>({
  contentTypeId
}: {
  contentTypeId: string;
  locale?: string;
}): Promise<SyncCollection> => {
  return client.sync({
    initial: true,
    content_type: contentTypeId,
    resolveLinks: false
  });
};
export default syncAllEntriesForContentType;
