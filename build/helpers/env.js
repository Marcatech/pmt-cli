"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const path_1 = __importDefault(require("path"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const loadEnv = () => {
    try {
        require('dotenv').config();
        for (const envPath of prisma_multi_tenant_shared_updated_1.envPaths) {
            if (envPath)
                require('dotenv').config({
                    path: path_1.default.resolve(process.cwd(), envPath),
                });
        }
    }
    catch (_a) { }
};
exports.loadEnv = loadEnv;
