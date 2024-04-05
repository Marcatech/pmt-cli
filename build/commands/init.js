"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const misc_1 = require("../helpers/misc");
const prompt_1 = __importDefault(require("../helpers/prompt"));
const generate_1 = __importDefault(require("./generate"));
const migrate_1 = __importDefault(require("./migrate"));
class Init {
    constructor() {
        this.name = 'init';
        this.args = [];
        this.options = [
            {
                name: 'url',
                description: 'URL of the management database',
            },
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
            {
                name: 'no-example',
                description: 'Disable creation of example file',
                boolean: true,
            },
        ];
        this.description = 'Init multi-tenancy for your application';
    }
    async execute(args, management) {
        await this.installPMT();
        const managementUrl = await this.getManagementDatasource(args);
        const firstTenant = await this.updateEnvAndSchemaFiles(managementUrl, args.options.schema);
        await this.generateClients(args.options.schema);
        await this.setUpManagement();
        if (firstTenant) {
            await this.createFirstTenant(firstTenant, management);
        }
        if (!args.options['no-example']) {
        }
        console.log((0, chalk_1.default) `\n✅  {green Your app is now ready for multi-tenancy!}\n`);
        console.log((0, chalk_1.default) `  {bold Next step:} Create a new tenant with \`prisma-multi-tenant new\`\n`);
    }
    async installPMT() {
        console.log('\n  Installing `@prisma-multi-tenant/client` as a dependency in your app...');
        const isUsingYarn = await (0, misc_1.useYarn)();
        const command = isUsingYarn ? 'yarn add --ignore-workspace-root-check' : 'npm install';
        const devOption = isUsingYarn ? '--dev' : '-D';
        console.log("Modified version of this is installing the client from local disk instead of from npm");
        await (0, prisma_multi_tenant_shared_updated_1.runShell)(`${command} prisma-multi-tenant-client-updated`);
        if (!(await (0, prisma_multi_tenant_shared_updated_1.isPrismaCliLocallyInstalled)())) {
            console.log('\n  Also installing `prisma` as a dev dependency in your app...');
            await (0, prisma_multi_tenant_shared_updated_1.runShell)(`${command} ${devOption} prisma`);
        }
    }
    async getManagementDatasource(args) {
        console.log((0, chalk_1.default) `\n  {yellow We will now configure the management database:}\n`);
        let { url: managementUrl } = await prompt_1.default.managementConf(args);
        const schemaPath = args.options.schema || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
        managementUrl = (0, prisma_multi_tenant_shared_updated_1.translateDatasourceUrl)(managementUrl, path_1.default.dirname(schemaPath));
        process.env.MANAGEMENT_URL = managementUrl;
        return managementUrl;
    }
    async updateEnvAndSchemaFiles(managementUrl, schemaPath) {
        var _a, _b;
        console.log('\n  Updating .env and schema.prisma files...');
        let firstTenantUrl;
        let mustAddDatabaseUrlEnv = false;
        try {
            let schemaFile = await (0, prisma_multi_tenant_shared_updated_1.readSchemaFile)(schemaPath);
            const datasourceConfig = (_a = schemaFile.match(/datasource\s*\w*\s*\{\s([^}]*)\}/)) === null || _a === void 0 ? void 0 : _a[1];
            if (!datasourceConfig) {
                throw new Error('No config found in schema.prisma');
            }
            const datasourceConfigUrl = (_b = datasourceConfig
                .split('\n')
                .map((l) => l
                .trim()
                .split('=')
                .map((l) => l.trim()))
                .find(([key]) => key === 'url')) === null || _b === void 0 ? void 0 : _b[1];
            if (!datasourceConfigUrl) {
                throw new Error('No url found in datasource');
            }
            if (datasourceConfigUrl.startsWith('env("') && datasourceConfigUrl.endsWith('")')) {
                const envName = datasourceConfigUrl.slice(5, -2);
                firstTenantUrl = process.env[envName] || undefined;
                if (envName !== 'DATABASE_URL') {
                    mustAddDatabaseUrlEnv = true;
                }
            }
            else if (datasourceConfigUrl.startsWith('"') && datasourceConfigUrl.endsWith('"')) {
                firstTenantUrl = datasourceConfigUrl.slice(1, -1);
                mustAddDatabaseUrlEnv = true;
            }
            else {
                throw new Error(`Unknown format for url: "${datasourceConfigUrl}"`);
            }
            if (mustAddDatabaseUrlEnv) {
                schemaFile = schemaFile.replace(datasourceConfigUrl, 'env("DATABASE_URL")');
                await (0, prisma_multi_tenant_shared_updated_1.writeSchemaFile)(schemaFile, schemaPath);
            }
        }
        catch (_c) { }
        let envFile = '';
        try {
            envFile = await (0, prisma_multi_tenant_shared_updated_1.readEnvFile)(schemaPath);
        }
        catch (_d) { }
        if (mustAddDatabaseUrlEnv) {
            envFile += `\nDATABASE_URL=${firstTenantUrl || ''}`;
            process.env.DATABASE_URL = firstTenantUrl || '';
        }
        envFile += `

      # The following env variable is used by prisma-multi-tenant
      
      MANAGEMENT_URL=${managementUrl}
    `
            .split('\n')
            .map((x) => x.substr(6))
            .join('\n');
        await (0, prisma_multi_tenant_shared_updated_1.writeEnvFile)(envFile, schemaPath);
        if (!firstTenantUrl) {
            console.error((0, chalk_1.default) `\n  {red Couldn't find initial datasource url}`);
            return null;
        }
        return {
            name: 'dev',
            url: firstTenantUrl,
        };
    }
    async generateClients(schemaPath) {
        console.log('\n  Generating prisma clients for both management and tenants...');
        await generate_1.default.generateTenants(schemaPath);
        await generate_1.default.generateManagement();
    }
    setUpManagement() {
        console.log('\n  Setting up management database...');
        return migrate_1.default.migrateManagement('deploy');
    }
    async createFirstTenant(firstTenant, management) {
        console.log('\n  Creating first tenant from your initial schema...');
        console.log("now deploying tenants...");
        await migrate_1.default.migrateTenant('deploy', firstTenant);
        console.log("now generating tenants...");
        await generate_1.default.generateTenants();
        console.log("now creating management...");
        await management.create(firstTenant);
        console.log("All important tasks done...");
    }
    async createExample(firstTenant) {
        console.log('\n  Skipping creation of example file...');
    }
}
exports.default = new Init();
