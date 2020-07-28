"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
exports.default = (function (obj) {
    var _a = obj.fields, title = _a.title, description = _a.description, _b = _a.file, url = _b.url, _c = _b.details, size = _c.size, _d = _c.image, width = _d.width, height = _d.height, filename = _b.fileName, contentType = _b.contentType;
    return lodash_1.default.pickBy({
        title: title,
        description: description,
        url: url,
        size: size,
        width: width,
        height: height,
        filename: filename,
        contentType: contentType
    }, lodash_1.default.identity);
});
