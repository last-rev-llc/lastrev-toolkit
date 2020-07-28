"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var writeSettings_1 = __importDefault(require("./writeSettings"));
var writePaths_1 = __importDefault(require("./writePaths"));
var writeMappings_1 = __importDefault(require("./writeMappings"));
var writeAdapterConfig_1 = __importDefault(require("./writeAdapterConfig"));
var writeLocaleData_1 = __importDefault(require("./writeLocaleData"));
var getBuildTasks = function (buildConfig) {
    var out = [];
    if (buildConfig.writeSettings)
        out.push(writeSettings_1.default);
    if (buildConfig.writePaths)
        out.push(writePaths_1.default);
    if (buildConfig.writeMappings)
        out.push(writeMappings_1.default);
    if (buildConfig.writeAdapterConfig)
        out.push(writeAdapterConfig_1.default);
    if (buildConfig.writeLocaleData)
        out.push(writeLocaleData_1.default);
    return out;
};
exports.default = getBuildTasks;
