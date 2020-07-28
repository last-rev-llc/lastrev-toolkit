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
var lodash_1 = __importDefault(require("lodash"));
var linkParser_1 = __importDefault(require("../linkParser"));
var assetParser_1 = __importDefault(require("../assetParser"));
var entryParser_1 = __importDefault(require("../entryParser"));
var helpers_1 = require("../helpers");
var Adapter = function (_a) {
    var _b = _a.urlMap, urlMap = _b === void 0 ? {} : _b, _c = _a.linkContentType, linkContentType = _c === void 0 ? 'elementLink' : _c, _d = _a.sameWindowActionText, sameWindowActionText = _d === void 0 ? 'Open in the same window' : _d, _e = _a.newWindowActionText, newWindowActionText = _e === void 0 ? 'Open in a new window' : _e, _f = _a.modalActionText, modalActionText = _f === void 0 ? 'Open in a modal' : _f, _g = _a.downloadActionText, downloadActionText = _g === void 0 ? 'Download' : _g, _h = _a.manualEntryTypeText, manualEntryTypeText = _h === void 0 ? 'Manual text entry' : _h, _j = _a.contentRefTypeText, contentRefTypeText = _j === void 0 ? 'Content reference' : _j, _k = _a.assetRefTypeText, assetRefTypeText = _k === void 0 ? 'Asset reference' : _k;
    return function (data) {
        var traverse = function (obj) {
            if (lodash_1.default.isArray(obj)) {
                return lodash_1.default.map(obj, traverse);
            }
            if (helpers_1.isLink(obj, linkContentType)) {
                return linkParser_1.default({
                    sameWindowActionText: sameWindowActionText,
                    newWindowActionText: newWindowActionText,
                    modalActionText: modalActionText,
                    downloadActionText: downloadActionText,
                    manualEntryTypeText: manualEntryTypeText,
                    contentRefTypeText: contentRefTypeText,
                    assetRefTypeText: assetRefTypeText,
                    fields: obj.fields,
                    urlMap: urlMap
                });
            }
            if (helpers_1.isEntry(obj)) {
                var parsed = entryParser_1.default(obj, urlMap);
                var parsedFields = lodash_1.default.mapValues(obj.fields, traverse);
                return __assign(__assign({}, parsed), parsedFields);
            }
            if (helpers_1.isAsset(obj)) {
                return assetParser_1.default(obj);
            }
            if (lodash_1.default.isObject(obj)) {
                return lodash_1.default.mapValues(obj, traverse);
            }
            // most likely a simple value field
            return obj;
        };
        return traverse(data);
    };
};
exports.default = Adapter;
