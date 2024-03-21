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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const src_1 = require("../../../shared/src");
const misc_1 = require("../helpers/misc");
class Eject {
    constructor() {
        this.name = 'eject';
        this.args = [];
        this.description = 'Eject prisma-multi-tenant from your application';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((0, chalk_1.default) `\n  {yellow Ejecting \`prisma-multi-tenant\` from your app...}`);
            const yarnOrNpm = (yield (0, misc_1.useYarn)()) ? 'yarn remove' : 'npm uninstall';
            yield (0, src_1.runShell)(`${yarnOrNpm} @prisma-multi-tenant/client`);
            console.log((0, chalk_1.default) `\n✅  {green Successfully removed \`@prisma-multi-tenant/client\` from your app. Bye! 👋}\n`);
        });
    }
}
exports.default = new Eject();
