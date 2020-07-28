"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
require('./helpers/loadEnv');
// eslint-disable-next-line import/first
var prefetch_1 = __importDefault(require("./prefetch"));
prefetch_1.default()
    .then(function () { return console.log('Successfully wrote content files'); })
    .catch(function (err) {
    console.log('Unable to write content files:', err);
});
