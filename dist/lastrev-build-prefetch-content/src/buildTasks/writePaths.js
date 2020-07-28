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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var integration_contentful_1 = require("@last-rev/integration-contentful");
var lodash_1 = __importDefault(require("lodash"));
var constants_1 = require("../constants");
var writeFile_1 = __importDefault(require("../helpers/writeFile"));
var mkDirIfNotExists_1 = __importDefault(require("../helpers/mkDirIfNotExists"));
var writePathsJs = function (buildConfig) {
    var typeSlugsTuples = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        typeSlugsTuples[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var paths, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = {};
                    lodash_1.default.each(typeSlugsTuples, function (_a) {
                        var type = _a[0], slugs = _a[1];
                        paths[type] = lodash_1.default.map(slugs, function (slug) {
                            var out = {};
                            var configPaths = buildConfig.paths;
                            out[configPaths[type]] = slug;
                            return { params: out };
                        });
                    });
                    out = "export default " + JSON.stringify(paths, null, 2) + ";";
                    return [4 /*yield*/, writeFile_1.default(constants_1.PATHS_FILE, out)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var getStaticSlugs = function (contentType) { return __awaiter(void 0, void 0, void 0, function () {
    var slugs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, integration_contentful_1.getStaticSlugsForContentType({ contentTypeId: contentType })];
            case 1:
                slugs = _a.sent();
                return [2 /*return*/, [contentType, slugs]];
        }
    });
}); };
var getStaticSlugFunctions = function (buildConfig) {
    if (!buildConfig || !buildConfig.paths)
        return [];
    return lodash_1.default.map(lodash_1.default.keys(buildConfig.paths), function (conf) {
        return getStaticSlugs(conf);
    });
};
var writePaths = function (buildConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var staticSlugFunctions, typeSlugTuples;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkDirIfNotExists_1.default(constants_1.CONTENT_DIR)];
            case 1:
                _a.sent();
                staticSlugFunctions = getStaticSlugFunctions(buildConfig);
                return [4 /*yield*/, Promise.all(__spreadArrays(staticSlugFunctions))];
            case 2:
                typeSlugTuples = (_a.sent()).slice(0);
                return [4 /*yield*/, writePathsJs.apply(void 0, __spreadArrays([buildConfig], typeSlugTuples))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.default = writePaths;
