declare const _default: {
    linkText: string;
    action: string;
    destinationType: string;
    assetReference: {
        sys: {
            space: {
                sys: {
                    type: string;
                    linkType: string;
                    id: string;
                };
            };
            type: string;
            id: string;
            revision: number;
            createdAt: string;
            updatedAt: string;
            environment: {
                sys: {
                    id: string;
                    type: string;
                    linkType: string;
                };
            };
            locale: string;
        };
        fields: {
            title: string;
            file: {
                url: string;
                details: {
                    size: number;
                    image: {
                        width: number;
                        height: number;
                    };
                };
                fileName: string;
                contentType: string;
            };
        };
        toPlainObject: () => void;
        update: () => void;
    };
    contentReference: {
        sys: {
            space: {
                sys: {
                    type: string;
                    linkType: string;
                    id: string;
                };
            };
            type: string;
            id: string;
            contentType: {
                sys: {
                    type: string;
                    linkType: string;
                    id: string;
                };
            };
            revision: number;
            createdAt: string;
            updatedAt: string;
            environment: {
                sys: {
                    id: string;
                    type: string;
                    linkType: string;
                };
            };
            locale: string;
        };
        fields: {
            internalTitle: string;
            slug: string;
            hero: {
                sys: {
                    type: string;
                    linkType: string;
                    id: string;
                };
            };
            content: {
                sys: {
                    type: string;
                    linkType: string;
                    id: string;
                };
            }[];
            seo: {};
        };
        toPlainObject: () => void;
        update: () => void;
    };
    manualUrl: string;
};
export default _default;
//# sourceMappingURL=linkParser.mock.d.ts.map