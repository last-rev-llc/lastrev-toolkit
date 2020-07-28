"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var entryParser_1 = __importDefault(require("./entryParser"));
var entryParser_mock_1 = __importDefault(require("./entryParser.mock"));
var urlMap = {
    pageGeneral: {
        url: '/test/[key]',
        key: 'slug'
    }
};
describe('entryParser.js', function () {
    test('parses all fields correctly when mapping exists', function () {
        var out = entryParser_1.default(entryParser_mock_1.default, urlMap);
        expect(out).toEqual({
            _id: lodash_1.default.get(entryParser_mock_1.default, 'sys.id'),
            _contentTypeId: lodash_1.default.get(entryParser_mock_1.default, 'sys.contentType.sys.id'),
            _href: "/test/[slug]",
            _as: "/test/" + lodash_1.default.get(entryParser_mock_1.default, 'fields.slug')
        });
    });
    test('parses all fields correctly when mapping does not exist', function () {
        var out = entryParser_1.default(entryParser_mock_1.default, {});
        expect(out).toEqual({
            _id: lodash_1.default.get(entryParser_mock_1.default, 'sys.id'),
            _contentTypeId: lodash_1.default.get(entryParser_mock_1.default, 'sys.contentType.sys.id')
        });
    });
    test('returns empty object when not a contentful item', function () {
        var obj = lodash_1.default.set(lodash_1.default.assign({}, entryParser_mock_1.default), 'sys', {});
        var out = entryParser_1.default(obj, urlMap);
        expect(out).toEqual({});
    });
    test('returns no _href or as _as properties when slug not found', function () {
        var obj = lodash_1.default.set(lodash_1.default.assign({}, entryParser_mock_1.default), 'fields', { notaSlug: 'hello' });
        var out = entryParser_1.default(obj, urlMap);
        expect(out).toEqual({
            _id: lodash_1.default.get(entryParser_mock_1.default, 'sys.id'),
            _contentTypeId: lodash_1.default.get(entryParser_mock_1.default, 'sys.contentType.sys.id')
        });
    });
});
