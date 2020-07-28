import { ContentfulClientApi, ContentTypeCollection } from 'contentful';

const getContentTypes = (client: ContentfulClientApi) => async (): Promise<ContentTypeCollection> => {
  return client.getContentTypes();
};

export default getContentTypes;
