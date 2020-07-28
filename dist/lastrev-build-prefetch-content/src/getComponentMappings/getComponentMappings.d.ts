declare type MappingConfig = {
    overrides?: Record<string, string>;
    exclude?: string[];
};
declare const getComponentMappings: (componentNames: string[], contentTypes: {
    sys: {
        id: string;
    };
}[], config?: MappingConfig) => Record<string, string>;
export default getComponentMappings;
//# sourceMappingURL=getComponentMappings.d.ts.map