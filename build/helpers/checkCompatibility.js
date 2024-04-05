"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const compareVersions = (a, b) => {
    const aParts = a.split('.');
    const bParts = b.split('.');
    for (const i in aParts) {
        if (aParts[i] > bParts[i]) {
            return 1;
        }
        else if (aParts[i] < bParts[i]) {
            return -1;
        }
    }
    return 0;
};
exports.default = async () => {
    try {
        let prismaVersion;
        try {
            prismaVersion = require('prisma/package.json').version;
        }
        catch (_a) {
            console.warn(chalk_1.default.yellow `Warning: Couldn't find @prisma/cli in node_modules. Did you forget to install it locally?`);
            return;
        }
        const { dependencies } = require(path_1.default.join(__dirname, '../../package.json'));
        const prismaVersionRequired = dependencies['prisma'].replace('^', '');
        if (compareVersions(prismaVersion, prismaVersionRequired) == -1) {
            console[process.env.PMT_TEST ? 'log' : 'warn'](chalk_1.default.yellow(`Warning: This version of prisma-multi-tenant is compatible with prisma@${prismaVersionRequired}, but you have prisma@${prismaVersion} installed. This may break in unexpected ways.`));
            return;
        }
    }
    catch (e) {
        console.log(e);
        console.warn(chalk_1.default.yellow `Warning: Couldn't verify version compatibility with @prisma/cli. Did you forget to install it locally?`);
    }
};
