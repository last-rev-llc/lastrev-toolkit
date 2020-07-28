import { ContentType, ContentfulClientApi } from 'contentful';

const getContentType = (client: ContentfulClientApi) => async ({
  contentTypeId
}: {
  contentTypeId: string;
}): Promise<ContentType> => {
  return client.getContentType(contentTypeId);
};

export default getContentType;
