import { ContentType, ContentfulClientApi } from 'contentful';
declare const getContentType: (client: ContentfulClientApi) => ({ contentTypeId }: {
    contentTypeId: string;
}) => Promise<ContentType>;
export default getContentType;
//# sourceMappingURL=getContentType.d.ts.map