"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var pascalCase_1 = __importDefault(require("../helpers/pascalCase"));
var getComponentMappings = function (componentNames, contentTypes, config) {
    var filteredComponentNames = lodash_1.default.filter(componentNames, function (component) {
        return !(config && config.exclude && lodash_1.default.includes(config.exclude, component));
    });
    var isOverriden = function (contentTypeId) {
        return config && lodash_1.default.has(config.overrides, contentTypeId);
    };
    var componentExists = function (component) {
        return lodash_1.default.includes(filteredComponentNames, component);
    };
    var out = {};
    lodash_1.default.each(contentTypes, function (item) {
        var contentTypeId = item.sys.id;
        var defaultComponentName = pascalCase_1.default(contentTypeId);
        if (isOverriden(contentTypeId)) {
            var component = config.overrides[contentTypeId];
            if (componentExists(component)) {
                out[contentTypeId] = component;
            }
            return;
        }
        if (componentExists(defaultComponentName)) {
            out[contentTypeId] = defaultComponentName;
        }
    });
    return out;
};
exports.default = getComponentMappings;
