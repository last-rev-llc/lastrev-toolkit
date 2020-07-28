"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var helpers_1 = require("../helpers");
var getUrl = function (mapping, slug) {
    return [mapping.url.replace('[key]', "[" + mapping.key + "]"), mapping.url.replace('[key]', "" + slug)];
};
exports.default = (function (obj, urlMap) {
    var _id = helpers_1.extractId(obj);
    var _contentTypeId = helpers_1.extractContentTypeId(obj);
    var slug = helpers_1.extractSlug(obj);
    var mapped = lodash_1.default.get(urlMap, _contentTypeId);
    var _a = mapped && slug ? getUrl(mapped, slug) : [], _href = _a[0], _as = _a[1];
    return lodash_1.default.pickBy({
        _id: _id,
        _contentTypeId: _contentTypeId,
        _href: _href,
        _as: _as
    }, lodash_1.default.identity);
});
