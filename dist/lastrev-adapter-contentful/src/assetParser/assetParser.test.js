"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assetParser_1 = __importDefault(require("./assetParser"));
var assetParser_mock_1 = __importDefault(require("./assetParser.mock"));
describe('assetParser.js', function () {
    test('correctly parsers asset', function () {
        var parsed = assetParser_1.default(assetParser_mock_1.default);
        expect(parsed).toMatchSnapshot();
    });
    test('removes undefined values', function () {
        var _a = assetParser_mock_1.default.fields, title = _a.title, file = _a.file, sys = assetParser_mock_1.default.sys;
        var parsed = assetParser_1.default({
            fields: {
                title: title,
                file: file
            },
            sys: sys
        });
        expect(parsed).toMatchSnapshot();
    });
});
