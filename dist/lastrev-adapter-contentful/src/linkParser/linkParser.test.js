"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var linkParser_1 = __importDefault(require("./linkParser"));
var linkParser_mock_1 = __importDefault(require("./linkParser.mock"));
var baseData = {
    sameWindowActionText: 'Open in the same window',
    newWindowActionText: 'Open in a new window',
    modalActionText: 'Open in a modal',
    downloadActionText: 'Download',
    manualEntryTypeText: 'Manual text entry',
    contentRefTypeText: 'Content reference',
    assetRefTypeText: 'Asset reference',
    contentTypeId: 'testPage',
    urlMap: {
        pageGeneral: {
            url: '/test/[key]',
            key: 'slug'
        }
    }
};
describe('linkParser', function () {
    describe('destination type: manualUrl', function () {
        test('action: open in the same window', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Manual text entry', action: 'Open in the same window' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.manualUrl);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(false);
        });
        test('action: open in a new window', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Manual text entry', action: 'Open in a new window' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.manualUrl);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe('_blank');
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(false);
        });
        test('action: open in a modal', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Manual text entry', action: 'Open in a modal' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.manualUrl);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(true);
            expect(parsed.download).toBe(false);
        });
        test('action: Download', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Manual text entry', action: 'Download' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.manualUrl);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(true);
        });
    });
    describe('destination type: Content reference', function () {
        test('action: open in the same window', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Content reference', action: 'Open in the same window' }) }));
            expect(parsed.href).toBe('/test/[slug]');
            expect(parsed.as).toBe("/test/" + linkParser_mock_1.default.contentReference.fields.slug);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(false);
        });
        test('action: open in a new window', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Content reference', action: 'Open in a new window' }) }));
            expect(parsed.href).toBe('/test/[slug]');
            expect(parsed.as).toBe("/test/" + linkParser_mock_1.default.contentReference.fields.slug);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe('_blank');
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(false);
        });
        test('action: open in a modal', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Content reference', action: 'Open in a modal' }) }));
            expect(parsed.href).toBe('/test/[slug]');
            expect(parsed.as).toBe("/test/" + linkParser_mock_1.default.contentReference.fields.slug);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(true);
            expect(parsed.download).toBe(false);
        });
        test('action: Download', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Content reference', action: 'Download' }) }));
            expect(parsed.href).toBe('/test/[slug]');
            expect(parsed.as).toBe("/test/" + linkParser_mock_1.default.contentReference.fields.slug);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(true);
        });
    });
    describe('destination type: Asset reference', function () {
        test('action: open in the same window', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Asset reference', action: 'Open in the same window' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.assetReference.fields.file.url);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(false);
        });
        test('action: open in a new window', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Asset reference', action: 'Open in a new window' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.assetReference.fields.file.url);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe('_blank');
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(false);
        });
        test('action: open in a modal', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Asset reference', action: 'Open in a modal' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.assetReference.fields.file.url);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(true);
            expect(parsed.download).toBe(false);
        });
        test('action: Download', function () {
            var parsed = linkParser_1.default(__assign(__assign({}, baseData), { fields: __assign(__assign({}, linkParser_mock_1.default), { destinationType: 'Asset reference', action: 'Download' }) }));
            expect(parsed.href).toBe(linkParser_mock_1.default.assetReference.fields.file.url);
            expect(parsed.as).toBe(null);
            expect(parsed.linkText).toBe(linkParser_mock_1.default.linkText);
            expect(parsed.target).toBe(null);
            expect(parsed.isModal).toBe(false);
            expect(parsed.download).toBe(true);
        });
    });
});
