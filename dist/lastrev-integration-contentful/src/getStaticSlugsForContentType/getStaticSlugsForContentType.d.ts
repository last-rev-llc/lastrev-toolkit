import { ContentfulClientApi } from 'contentful';
declare const getStaticSlugsForContentTypeCreator: (client: ContentfulClientApi) => ({ contentTypeId, slugFieldName, order }: {
    contentTypeId: string;
    slugFieldName?: string;
    order?: string;
}) => Promise<string[]>;
export default getStaticSlugsForContentTypeCreator;
//# sourceMappingURL=getStaticSlugsForContentType.d.ts.map