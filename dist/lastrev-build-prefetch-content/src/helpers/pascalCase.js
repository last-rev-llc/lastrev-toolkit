"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
var lodash_1 = __importDefault(require("lodash"));
exports.default = lodash_1.default.flow(lodash_1.default.camelCase, lodash_1.default.upperFirst);
