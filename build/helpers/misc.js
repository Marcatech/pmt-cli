"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useYarn = void 0;
const path_1 = __importDefault(require("path"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const useYarn = async () => {
    if (await (0, prisma_multi_tenant_shared_updated_1.fileExists)(path_1.default.join(process.cwd(), 'yarn.lock'))) {
        return true;
    }
    if (await (0, prisma_multi_tenant_shared_updated_1.fileExists)(path_1.default.join(process.cwd(), '../yarn.lock'))) {
        return true;
    }
    return false;
};
exports.useYarn = useYarn;
