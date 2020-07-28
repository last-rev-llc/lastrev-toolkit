import { ContentfulClientApi, Locale } from 'contentful';

const getLocalesCreator = (client: ContentfulClientApi) => async (): Promise<Locale[]> => {
  const queryResult = await client.getLocales();

  return queryResult.items;
};

export default getLocalesCreator;
