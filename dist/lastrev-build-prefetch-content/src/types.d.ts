export declare type MappingConfig = {
    overrides?: Record<string, string>;
    exclude?: string[];
};
export declare type LocalesConfig = {
    localizationLookupFieldName?: string;
    rawPagesDir?: string;
    outputPath?: string;
};
export declare type BuildConfig = {
    useAdapter?: boolean;
    mappings?: MappingConfig;
    paths?: Record<string, string>;
    settingsInclude?: number;
    locales?: LocalesConfig;
    settingsContentType?: string;
    writeSettings?: boolean;
    writePaths?: boolean;
    writeMappings?: boolean;
    writeAdapterConfig?: boolean;
    writeLocaleData?: boolean;
};
export declare type BuildTask = (buildConfig: BuildConfig, other: Record<string, unknown>) => Promise<void>;
export declare type TypeSlugsTuple = [string, string[]];
//# sourceMappingURL=types.d.ts.map