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
const prompt_1 = __importDefault(require("../helpers/prompt"));
const migrate_1 = __importDefault(require("./migrate"));
class Delete {
    constructor() {
        this.name = 'delete';
        this.altNames = ['remove'];
        this.args = [
            {
                name: 'name',
                description: 'Name of the tenant you want to delete',
            },
        ];
        this.options = [
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
            {
                name: 'force',
                description: 'Delete the tenant without asking for confirmation',
                boolean: true,
            },
        ];
        this.description = 'Delete one tenant';
    }
    execute(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log();
            const [name] = args.args;
            if (!args.options.force &&
                !(yield prompt_1.default.confirm((0, chalk_1.default) `{red Are you sure you want to delete the tenant "${name}"?}`))) {
                return;
            }
            yield migrate_1.default.migrateOneTenant(management, 'down', name, args.options.schema).catch((e) => {
                if (args.options.force) {
                    console.error(e);
                }
                else {
                    throw e;
                }
            });
            yield management.delete(name);
            console.log((0, chalk_1.default) `\n✅  {green Migrated down "${name}" and deleted it from management!}\n`);
            console.log((0, chalk_1.default) `  {yellow {bold Note:} You are still in charge of deleting the database!}\n`);
        });
    }
}
exports.default = new Delete();
