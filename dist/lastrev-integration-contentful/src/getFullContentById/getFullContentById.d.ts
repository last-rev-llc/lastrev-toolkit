import { ContentfulClientApi, Entry } from 'contentful';
import { GetFullContentByIdConfig } from '../types';
declare const getFullContentByIdCreator: (client: ContentfulClientApi) => <T>({ contentTypeId, id, locale, include }: GetFullContentByIdConfig) => Promise<Entry<T>>;
export default getFullContentByIdCreator;
//# sourceMappingURL=getFullContentById.d.ts.map