export declare type SafeEntryCollection = {
    items: Record<string, unknown>[];
};
export declare type GetPageBySlugConfig = {
    slug: string;
    contentTypeId: string;
    locale?: string;
    include?: number;
    slugFieldName?: string;
};
export declare type GetFullContentByIdConfig = {
    contentTypeId: string;
    id: string;
    locale?: string;
    include: number;
};
export declare type GetGlobalSettingsConfig = {
    locale?: string;
    include?: number;
    contentTypeId?: string;
};
export declare type LocalizationLookupMapping = Record<string, Record<string, string>>;
//# sourceMappingURL=types.d.ts.map