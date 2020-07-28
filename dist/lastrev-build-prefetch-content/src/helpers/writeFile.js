"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var fs_1 = require("fs");
var writeFile = util_1.promisify(fs_1.writeFile);
exports.default = writeFile;
