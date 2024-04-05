"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const misc_1 = require("../helpers/misc");
class Eject {
    constructor() {
        this.name = 'eject';
        this.args = [];
        this.description = 'Eject prisma-multi-tenant from your application';
    }
    async execute() {
        console.log((0, chalk_1.default) `\n  {yellow Ejecting \`prisma-multi-tenant\` from your app...}`);
        const yarnOrNpm = (await (0, misc_1.useYarn)()) ? 'yarn remove' : 'npm uninstall';
        await (0, prisma_multi_tenant_shared_updated_1.runShell)(`${yarnOrNpm} @prisma-multi-tenant/client`);
        console.log((0, chalk_1.default) `\n✅  {green Successfully removed \`@prisma-multi-tenant/client\` from your app. Bye! 👋}\n`);
    }
}
exports.default = new Eject();
