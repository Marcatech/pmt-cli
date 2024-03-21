"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const path_1 = __importDefault(require("path"));
const src_1 = require("../../../shared/src");
const loadEnv = () => {
    try {
        require('dotenv').config();
        for (const envPath of src_1.envPaths) {
            require('dotenv').config({
                path: path_1.default.resolve(process.cwd(), envPath),
            });
        }
    }
    catch (_a) { }
};
exports.loadEnv = loadEnv;
