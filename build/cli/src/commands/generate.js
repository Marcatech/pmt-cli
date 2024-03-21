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
class Generate {
    constructor() {
        this.name = 'generate';
        this.args = [];
        this.options = [
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
            {
                name: 'watch',
                description: 'Watches the Prisma project file',
                boolean: true,
            },
        ];
        this.description = 'Generate Prisma Clients for the tenants and management';
    }
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.options.watch) {
                console.log('\n  Generating Prisma Clients for both management and tenants...');
                yield this.generateTenants(args.options.schema, args.secondary);
                yield this.generateManagement();
                console.log((0, chalk_1.default) `\n✅  {green Prisma Clients have been generated!}\n`);
            }
            else {
                console.log('\n  Generating Prisma Client for management');
                yield this.generateManagement();
                console.log((0, chalk_1.default) `\n✅  {green Prisma Client for management has been generated!}\n`);
                console.log('\n  Generating and watching Prisma Client for tenants');
                yield this.watchGenerateTenants(args.options.schema, args.secondary);
            }
        });
    }
    generateTenants(schemaPath, prismaArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            schemaPath = schemaPath || (yield (0, src_1.getSchemaPath)());
            console.log("Schema Path: ", schemaPath);
            yield (0, src_1.runDistantPrisma)(`generate --schema ${schemaPath} ${prismaArgs || ''}`);
        });
    }
    generateManagement() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, src_1.runLocalPrisma)('generate');
        });
    }
    watchGenerateTenants(schemaPath, prismaArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            schemaPath = schemaPath || (yield (0, src_1.getSchemaPath)());
            (0, src_1.spawnShell)(`npx prisma generate --schema ${schemaPath} --watch ${prismaArgs || ''}`).then((exitCode) => process.exit(exitCode));
        });
    }
}
exports.default = new Generate();
