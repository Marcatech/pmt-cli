#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const commands = __importStar(require("./commands"));
const arguments_1 = require("./helpers/arguments");
const errors_1 = require("./helpers/errors");
const help_1 = __importDefault(require("./helpers/help"));
const env_1 = require("./helpers/env");
(0, env_1.loadEnv)();
const args = (0, arguments_1.parseArgs)();
let management;
const run = async () => {
    if ((0, arguments_1.shouldPrintHelp)(args)) {
        return help_1.default.printGlobalHelp();
    }
    if ((0, arguments_1.shouldPrintVersion)(args)) {
        return help_1.default.printGlobalVersion();
    }
    if ((0, arguments_1.shouldSetVerbose)(args)) {
        process.env.verbose = 'true';
        process.env.VERBOSE = 'true';
    }
    if ((0, arguments_1.shouldLoadEnv)(args)) {
        require('dotenv').config({
            path: path_1.default.resolve(process.cwd(), args.parsedPrimaryArgs['--env'] || ''),
        });
    }
    const { parsedPrimaryArgs, commandName } = args;
    const command = Object.values(commands).find((c) => { var _a; return c.name == commandName || ((_a = c.altNames) === null || _a === void 0 ? void 0 : _a.includes(commandName)); });
    if (!command) {
        throw new prisma_multi_tenant_shared_updated_1.PmtError('unrecognized-command', commandName);
    }
    if (parsedPrimaryArgs['--help']) {
        help_1.default.printCommandHelp(command);
        return;
    }
    management = new prisma_multi_tenant_shared_updated_1.Management();
    await command.execute((0, arguments_1.convertToCommandArgs)(command, args), management);
};
run()
    .then(async () => {
    if (management) {
        await management.disconnect();
    }
})
    .catch(async (err) => {
    (0, errors_1.printError)(err, args);
    if (management) {
        await management.disconnect();
    }
    process.exit(1);
});
