"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var contentfulAdapter_1 = __importDefault(require("./contentfulAdapter"));
var contentfulAdapter_mock_1 = __importDefault(require("./contentfulAdapter.mock"));
var urlMap = {
    pageGeneral: {
        url: '/[key]',
        key: 'slug'
    }
};
var transform = contentfulAdapter_1.default({
    urlMap: urlMap,
    linkContentType: 'uieCta',
    manualEntryTypeText: 'Manual URL',
    modalActionText: 'Open a modal',
    contentRefTypeText: 'ContentReference'
});
describe('Contentful Adapter', function () {
    it('converts the data correctly', function () {
        var out = transform(contentfulAdapter_mock_1.default);
        expect(out).toMatchSnapshot();
    });
    it('parses plain json correctly', function () {
        var obj = {
            sys: {
                space: {
                    sys: {
                        type: 'Link',
                        linkType: 'Space',
                        id: 'hhv516v5f7sj'
                    }
                },
                type: 'Entry',
                id: '1wmrGhKeCNbe3QssB6UNkN',
                contentType: {
                    sys: {
                        type: 'Link',
                        linkType: 'ContentType',
                        id: 'settingsGlobal'
                    }
                },
                revision: 2,
                createdAt: '2020-07-01T20:03:32.191Z',
                updatedAt: '2020-07-06T23:50:58.713Z',
                environment: {
                    sys: {
                        id: 'master',
                        type: 'Link',
                        linkType: 'Environment'
                    }
                },
                locale: 'en-US'
            },
            fields: {
                localizationLookup: {
                    recipeMinutes: 'min',
                    loginLinkLabel: 'LOG IN',
                    loginDescription: 'Already have an Impossible Taste Place™ account? Log in here.',
                    logOutButtonLabel: 'LOG OUT',
                    operatorLoginPreText: 'Restaurant operators',
                    createAccountLinkLabel: 'Sign up for Taste Place here.',
                    operatorLoginLinkLabel: 'log in here.',
                    createAccountDescription: 'Earn rewards with each purchase. Save earth. Connect with other Impossible fans.'
                }
            }
        };
        var out = transform(obj);
        expect(out).toMatchSnapshot();
    });
});
