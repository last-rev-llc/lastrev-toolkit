"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLink = exports.extractSlug = exports.extractId = exports.extractContentTypeId = exports.isAsset = exports.isEntry = exports.isContentfulObject = void 0;
var lodash_1 = __importDefault(require("lodash"));
exports.isContentfulObject = function (obj) {
    return typeof obj === 'object' && lodash_1.default.has(obj, 'sys') && lodash_1.default.has(obj, 'fields');
};
exports.isEntry = function (obj) {
    return exports.isContentfulObject(obj) && lodash_1.default.get(obj, 'sys.type') === 'Entry';
};
exports.isAsset = function (obj) {
    return exports.isContentfulObject(obj) && lodash_1.default.get(obj, 'sys.type') === 'Asset';
};
exports.extractContentTypeId = function (obj) {
    return (exports.isEntry(obj) && lodash_1.default.get(obj, 'sys.contentType.sys.id')) || null;
};
exports.extractId = function (obj) {
    return (exports.isEntry(obj) && lodash_1.default.get(obj, 'sys.id')) || null;
};
exports.extractSlug = function (obj) {
    return (exports.isEntry(obj) && lodash_1.default.get(obj, 'fields.slug')) || null;
};
exports.isLink = function (obj, contentTypeId) {
    return exports.isEntry(obj) && contentTypeId === exports.extractContentTypeId(obj);
};
