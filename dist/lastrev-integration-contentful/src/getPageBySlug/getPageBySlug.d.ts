import { ContentfulClientApi, Entry } from 'contentful';
import { GetPageBySlugConfig } from '../types';
declare const getPageBySlugCreator: (client: ContentfulClientApi) => <T>({ slug, contentTypeId, locale, include, slugFieldName }: GetPageBySlugConfig) => Promise<Entry<T>>;
export default getPageBySlugCreator;
//# sourceMappingURL=getPageBySlug.d.ts.map