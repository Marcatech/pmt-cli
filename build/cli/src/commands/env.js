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
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../shared/src");
class Env {
    constructor() {
        this.name = 'env';
        this.args = [
            {
                name: 'name',
                description: 'Name of the tenant you want in your env',
            },
        ];
        this.description = 'Set env variables for a specific tenant';
    }
    execute(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            const [name] = args.args;
            console.log(`\n  Running \`${args.secondary}\` on tenant "${name}"\n`);
            const tenant = yield management.read(name);
            process.env.DATABASE_URL = tenant.url;
            (0, src_1.spawnShell)(args.secondary).then((exitCode) => process.exit(exitCode));
        });
    }
}
exports.default = new Env();
