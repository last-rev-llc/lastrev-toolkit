"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var removeCircularRefs = function (entries) {
    return JSON.parse(entries.stringifySafe());
};
exports.default = removeCircularRefs;
