"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
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
    async execute(args) {
        if (!args.options.watch) {
            console.log('\n  Generating Prisma Clients for both management and tenants...');
            await this.generateTenants(args.options.schema, args.secondary);
            await this.generateManagement();
            console.log((0, chalk_1.default) `\n✅  {green Prisma Clients have been generated!}\n`);
        }
        else {
            console.log('\n  Generating Prisma Client for management');
            await this.generateManagement();
            console.log((0, chalk_1.default) `\n✅  {green Prisma Client for management has been generated!}\n`);
            console.log('\n  Generating and watching Prisma Client for tenants');
            await this.watchGenerateTenants(args.options.schema, args.secondary);
        }
    }
    async generateTenants(schemaPath, prismaArgs) {
        schemaPath = schemaPath || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
        console.log("Schema Path: ", schemaPath);
        await (0, prisma_multi_tenant_shared_updated_1.runDistantPrisma)(`generate --schema ${schemaPath} ${prismaArgs || ''}`);
    }
    async generateManagement() {
        await (0, prisma_multi_tenant_shared_updated_1.runLocalPrisma)('generate');
    }
    async watchGenerateTenants(schemaPath, prismaArgs) {
        schemaPath = schemaPath || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
        (0, prisma_multi_tenant_shared_updated_1.spawnShell)(`npx prisma generate --schema ${schemaPath} --watch ${prismaArgs || ''}`).then((exitCode) => process.exit(exitCode));
    }
}
exports.default = new Generate();
