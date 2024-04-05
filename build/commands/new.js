"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const prompt_1 = __importDefault(require("../helpers/prompt"));
const migrate_1 = __importDefault(require("./migrate"));
class New {
    constructor() {
        this.name = 'new';
        this.altNames = ['add'];
        this.args = [
            {
                name: 'management',
                optional: true,
                description: 'Create a new management',
            },
        ];
        this.options = [
            {
                name: 'name',
                description: 'Name of the tenant',
            },
            {
                name: 'url',
                description: 'URL of the database',
            },
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
            {
                name: 'no-management',
                description: 'The new tenant will not be registered in the management database',
                boolean: true,
            },
        ];
        this.description = 'Create a new tenant or management';
    }
    async execute(args, management) {
        if (args.args[0] === 'management') {
            await this.newManagement(args);
        }
        else {
            await this.newTenant(args, management);
        }
    }
    async newManagement(args) {
        console.log();
        const { url: databaseUrl } = await prompt_1.default.managementConf(args);
        const schemaPath = args.options.schema || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
        process.env.MANAGEMENT_URL = (0, prisma_multi_tenant_shared_updated_1.translateDatasourceUrl)(databaseUrl, path_1.default.dirname(schemaPath));
        await migrate_1.default.migrateManagement('deploy', '');
        console.log((0, chalk_1.default) `\n✅  {green Successfully created a new management database!}\n`);
    }
    async newTenant(args, management) {
        console.log();
        const tenant = await prompt_1.default.tenantConf(args);
        if (tenant.name === 'management') {
            throw new prisma_multi_tenant_shared_updated_1.PmtError('reserved-tenant-name', 'management');
        }
        await migrate_1.default.migrateTenant('deploy', tenant, args.options.schema, '');
        if (args.options['no-management']) {
            console.log((0, chalk_1.default) `\n✅  {green Created the new tenant (without management) and migrated up the database}\n`);
            return;
        }
        await management.create(tenant);
        console.log((0, chalk_1.default) `\n✅  {green Registered the new tenant into management and migrated up the database!}\n`);
    }
}
exports.default = new New();
