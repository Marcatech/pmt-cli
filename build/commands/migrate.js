"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
class Migrate {
    constructor() {
        this.name = 'migrate';
        this.args = [
            {
                name: 'name',
                optional: true,
                description: 'Name of the tenant you want to migrate',
            },
            {
                name: 'action',
                optional: false,
                description: 'Migrate "dev", "deploy" or "generate" the tenant',
            },
        ];
        this.options = [
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
        ];
        this.description = 'Migrate tenants (dev, deploy, generate)';
    }
    async execute(args, management) {
        const { name, action, prismaArgs } = this.parseArgs(args);
        if (action === 'generate') {
            await this.generatePrismaClient(args.options.schema);
            return;
        }
        if (!name) {
            console.log(`\n  Migrating ${action} all tenants...\n`);
            await this.migrateAllTenants(management, action, args.options.schema, prismaArgs);
        }
        else if (name === 'management') {
            console.log(`\n  Migrating management ${action}...`);
            await this.migrateManagement(action, prismaArgs);
        }
        else {
            console.log(`\n  Migrating "${name}" ${action}...`);
            await this.migrateOneTenant(management, action, name, args.options.schema, prismaArgs);
        }
    }
    parseArgs(args) {
        const [arg1, arg2, ...restArgs] = args.args;
        let name, action, prismaArgs;
        if (['dev', 'deploy', 'generate'].includes(arg2)) {
            name = arg1;
            action = arg2;
            prismaArgs = restArgs.join(' ');
        }
        else if (['dev', 'deploy', 'generate'].includes(arg1)) {
            action = arg1;
            prismaArgs = [arg2, ...restArgs].join(' ');
        }
        else {
            throw new prisma_multi_tenant_shared_updated_1.PmtError('unrecognized-migrate-action', args);
        }
        return { name, action, prismaArgs };
    }
    async migrateOneTenant(management, action, name, schemaPath, prismaArgs = '') {
        const tenant = await management.read(name);
        return this.migrateTenant(action, tenant, schemaPath, prismaArgs);
    }
    async migrateAllTenants(management, action, schemaPath, prismaArgs = '') {
        const tenants = await management.list();
        for (const tenant of tenants) {
            if (tenant.name !== "management") {
                console.log(`    > Migrating "${tenant.name}" ${action}`);
                await this.migrateTenant(action, tenant, schemaPath, prismaArgs);
            }
        }
    }
    async migrateTenant(action, tenant, schemaPath, prismaArgs = '') {
        schemaPath = schemaPath || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
        return (0, prisma_multi_tenant_shared_updated_1.runDistantPrisma)(`migrate ${action} --schema ${schemaPath} ${prismaArgs}`, tenant);
    }
    migrateManagement(action, prismaArgs = '') {
        return (0, prisma_multi_tenant_shared_updated_1.runLocalPrisma)(`migrate ${action} ${prismaArgs}`);
    }
    async generatePrismaClient(schemaPath) {
        schemaPath = schemaPath || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
        return (0, prisma_multi_tenant_shared_updated_1.runLocalPrisma)(`generate --schema ${schemaPath}`);
    }
}
exports.default = new Migrate();
