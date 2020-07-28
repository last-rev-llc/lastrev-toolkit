import { ContentfulClientApi, Locale } from 'contentful';
declare const getLocalesCreator: (client: ContentfulClientApi) => () => Promise<Locale[]>;
export default getLocalesCreator;
//# sourceMappingURL=getLocales.d.ts.map