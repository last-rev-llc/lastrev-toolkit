export declare type LinkTextTypes = {
    newWindowActionText: string;
    modalActionText: string;
    downloadActionText: string;
    manualEntryTypeText: string;
    contentRefTypeText: string;
    assetRefTypeText: string;
};
export declare type Entry<T> = {
    sys: {
        id: string;
        contentType: {
            sys: {
                id: string;
            };
        };
    };
    fields: T;
};
export declare type Asset = {
    fields: {
        title: string;
        description?: string;
        file: {
            url: string;
        };
    };
};
export declare type UrlMap = Record<string, {
    url: string;
    key: string;
}>;
export declare type ParsedEntry = {
    _id: string;
    _contentTypeId: string;
    _href?: string;
    _as?: string;
};
export declare type AdapterConfig = {
    urlMap?: Record<string, {
        url: string;
        key: string;
    }>;
    linkContentType?: string;
    sameWindowActionText?: string;
    newWindowActionText?: string;
    modalActionText?: string;
    downloadActionText?: string;
    manualEntryTypeText?: string;
    contentRefTypeText?: string;
    assetRefTypeText?: string;
};
export declare type Transform = (data: any) => Record<string, unknown>;
//# sourceMappingURL=types.d.ts.map