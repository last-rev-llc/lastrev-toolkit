"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var entryParser_mock_1 = __importDefault(require("../entryParser/entryParser.mock"));
exports.default = {
    linkText: 'hello',
    action: 'Open in the same window',
    destinationType: 'Asset reference',
    assetReference: {
        sys: {
            space: {
                sys: {
                    type: 'Link',
                    linkType: 'Space',
                    id: 'hhv516v5f7sj'
                }
            },
            type: 'Asset',
            id: '6QMUJWZt92qvZqns6hALpV',
            revision: 1,
            createdAt: '2020-07-02T19:20:34.318Z',
            updatedAt: '2020-07-02T19:21:17.235Z',
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
            title: 'Nav - Log In - Tout Image',
            file: {
                url: '//images.ctfassets.net/hhv516v5f7sj/6QMUJWZt92qvZqns6hALpV/3a7ce12e67c3ac0870c3d5137dac6643/nav-burger.png',
                details: {
                    size: 19552,
                    image: {
                        width: 200,
                        height: 100
                    }
                },
                fileName: 'nav-burger.png',
                contentType: 'image/png'
            }
        },
        toPlainObject: function () { },
        update: function () { }
    },
    contentReference: entryParser_mock_1.default,
    manualUrl: 'http://ww.google.com'
};
