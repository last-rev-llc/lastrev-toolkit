import { UrlMap, Entry, Asset } from '../types';
export declare type LinkParserConfig = {
    newWindowActionText: string;
    sameWindowActionText: string;
    modalActionText: string;
    downloadActionText: string;
    manualEntryTypeText: string;
    contentRefTypeText: string;
    assetRefTypeText: string;
    fields: {
        action: string;
        destinationType: string;
        linkText?: string;
        manualUrl?: string;
        contentReference?: Entry<{
            slug: string;
        }>;
        assetReference?: Asset;
    };
    urlMap?: UrlMap;
};
declare const _default: ({ newWindowActionText, modalActionText, downloadActionText, manualEntryTypeText, contentRefTypeText, assetRefTypeText, fields, urlMap }: LinkParserConfig) => {
    href: any;
    as: any;
    target: string;
    isModal: boolean;
    download: boolean;
    action: string;
    destinationType: string;
    linkText?: string;
    manualUrl?: string;
    contentReference?: Entry<{
        slug: string;
    }>;
    assetReference?: Asset;
};
export default _default;
//# sourceMappingURL=linkParser.d.ts.map