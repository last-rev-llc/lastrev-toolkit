"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getComponentMappings_1 = __importDefault(require("./getComponentMappings"));
var getComponentMappings_mock_1 = require("./getComponentMappings.mock");
describe('getComponentMappings.js', function () {
    test('returns correct mappings with no overrides or exclude', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes);
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with overrides and no exclude', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            overrides: {
                settingsGlobal: 'Layout'
            }
        });
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with exclude and no overrides', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            exclude: ['PageGeneral']
        });
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with both overrides and excludes', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            exclude: ['PageGeneral'],
            overrides: {
                settingsGlobal: 'Layout'
            }
        });
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with override containing non-existent component', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            overrides: {
                pageGeneral: 'Dummy'
            }
        });
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with override containing non-existent content type', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            overrides: {
                dummy: 'Dummy'
            }
        });
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with exclude containing non-existent component', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            overrides: {
                dummy: 'Dummy'
            }
        });
        expect(mappings).toMatchSnapshot();
    });
    test('returns correct mappings with overrides but exclude contains overriden component', function () {
        var mappings = getComponentMappings_1.default(getComponentMappings_mock_1.componentNames, getComponentMappings_mock_1.contentTypes, {
            exclude: ['Layout'],
            overrides: {
                settingsGlobal: 'Layout'
            }
        });
        expect(mappings).toMatchSnapshot();
    });
});
