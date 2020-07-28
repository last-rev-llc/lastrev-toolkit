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
var entryParser_1 = __importDefault(require("../entryParser"));
var getUrl = function (mapping, slug) {
    return {
        href: mapping.url.replace('[key]', "[" + mapping.key + "]"),
        as: mapping.url.replace('[key]', "" + slug)
    };
};
exports.default = (function (_a) {
    var _b;
    var newWindowActionText = _a.newWindowActionText, modalActionText = _a.modalActionText, downloadActionText = _a.downloadActionText, manualEntryTypeText = _a.manualEntryTypeText, contentRefTypeText = _a.contentRefTypeText, assetRefTypeText = _a.assetRefTypeText, fields = _a.fields, urlMap = _a.urlMap;
    var action = fields.action, destinationType = fields.destinationType, manualUrl = fields.manualUrl, contentReference = fields.contentReference, assetReference = fields.assetReference;
    var isModal = action === modalActionText;
    var download = action === downloadActionText;
    var target = action === newWindowActionText ? '_blank' : null;
    var href = null;
    var as = null;
    switch (destinationType) {
        case manualEntryTypeText:
            if (!manualUrl) {
                throw Error("DestinationType is " + manualEntryTypeText + ", but no URL has been entered");
            }
            href = manualUrl;
            break;
        case contentRefTypeText: {
            if (!contentReference) {
                throw Error("DestinationType is " + contentRefTypeText + ", but no content reference is selected");
            }
            var _c = entryParser_1.default(contentReference, urlMap), _href = _c._href, _as = _c._as, _contentTypeId = _c._contentTypeId;
            if (!_href || !_as) {
                throw Error("urlMap does not contain entry for " + _contentTypeId);
            }
            _b = [_href, _as], href = _b[0], as = _b[1];
            break;
        }
        case assetRefTypeText:
            if (!assetReference) {
                throw Error("DestinationType is " + assetRefTypeText + ", but no asset is selected");
            }
            (href = assetReference.fields.file.url);
            break;
        default:
            break;
    }
    return __assign(__assign({}, fields), { href: href,
        as: as,
        target: target,
        isModal: isModal,
        download: download });
});
