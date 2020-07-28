"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var integration_contentful_1 = require("@last-rev/integration-contentful");
var util_1 = require("util");
var fs_1 = require("fs");
var path_1 = require("path");
var slash_1 = __importDefault(require("slash"));
var handlebars_1 = __importDefault(require("handlebars"));
var constants_1 = require("../constants");
var mkDirIfNotExists_1 = __importDefault(require("../helpers/mkDirIfNotExists"));
var writeFile_1 = __importDefault(require("../helpers/writeFile"));
var getComponentMappings_1 = __importDefault(require("../getComponentMappings"));
var readdir = util_1.promisify(fs_1.readdir);
var writeMappingJs = function (mappings) { return __awaiter(void 0, void 0, void 0, function () {
    var componentsDir, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                componentsDir = slash_1.default(path_1.relative(constants_1.CONTENT_DIR, constants_1.COMPONENTS_DIR));
                out = handlebars_1.default.compile(constants_1.MAPPING_TEMPLATE)({ mappings: mappings, componentsDir: componentsDir });
                return [4 /*yield*/, writeFile_1.default(constants_1.COMPONENT_MAPPING_FILE, out)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var getAndProcessComponentMappings = function (buildConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, componentNames, queryResults;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.all([readdir(constants_1.COMPONENTS_DIR), integration_contentful_1.getContentTypes()])];
            case 1:
                _a = _b.sent(), componentNames = _a[0], queryResults = _a[1];
                return [2 /*return*/, getComponentMappings_1.default(componentNames, queryResults.items || [], buildConfig && buildConfig.mappings)];
        }
    });
}); };
var writeMappings = function (buildConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var mappings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkDirIfNotExists_1.default(constants_1.CONTENT_DIR)];
            case 1:
                _a.sent();
                return [4 /*yield*/, getAndProcessComponentMappings(buildConfig)];
            case 2:
                mappings = _a.sent();
                return [4 /*yield*/, writeMappingJs(mappings)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.default = writeMappings;
