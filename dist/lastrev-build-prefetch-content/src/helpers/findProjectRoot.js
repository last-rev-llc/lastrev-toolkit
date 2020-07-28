"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
// Simple version of `find-project-root`
// https://github.com/kirstein/find-project-root/blob/master/index.js
var MARKERS = ['.git', '.hg', 'package.json'];
var markerExists = function (directory) { return MARKERS.some(function (mark) { return fs_1.existsSync(path_1.join(directory, mark)); }); };
var findProjectRoot = function (directory) {
    if (directory === void 0) { directory = process.cwd(); }
    while (!markerExists(directory)) {
        var parentDirectory = path_1.resolve(directory, '..');
        if (parentDirectory === directory) {
            break;
        }
        // eslint-disable-next-line no-param-reassign
        directory = parentDirectory;
    }
    return directory;
};
exports.default = findProjectRoot;
