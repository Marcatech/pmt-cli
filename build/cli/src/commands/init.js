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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const src_1 = require("../../../shared/src");
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
    execute(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.installPMT();
            const managementUrl = yield this.getManagementDatasource(args);
            const firstTenant = yield this.updateEnvAndSchemaFiles(managementUrl, args.options.schema);
            yield this.generateClients(args.options.schema);
            yield this.setUpManagement();
            if (firstTenant) {
                yield this.createFirstTenant(firstTenant, management);
            }
            if (!args.options['no-example']) {
            }
            console.log((0, chalk_1.default) `\n✅  {green Your app is now ready for multi-tenancy!}\n`);
            console.log((0, chalk_1.default) `  {bold Next step:} Create a new tenant with \`prisma-multi-tenant new\`\n`);
        });
    }
    installPMT() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n  Installing `@prisma-multi-tenant/client` as a dependency in your app...');
            const isUsingYarn = yield (0, misc_1.useYarn)();
            const command = isUsingYarn ? 'yarn add --ignore-workspace-root-check' : 'npm install';
            const devOption = isUsingYarn ? '--dev' : '-D';
            console.log("Modified version of this is installing the client from local disk instead of from npm");
            yield (0, src_1.runShell)(`${command} prisma-multi-tenant-client-updated`);
            if (!(yield (0, src_1.isPrismaCliLocallyInstalled)())) {
                console.log('\n  Also installing `prisma` as a dev dependency in your app...');
                yield (0, src_1.runShell)(`${command} ${devOption} prisma`);
            }
        });
    }
    getManagementDatasource(args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((0, chalk_1.default) `\n  {yellow We will now configure the management database:}\n`);
            let { url: managementUrl } = yield prompt_1.default.managementConf(args);
            const schemaPath = args.options.schema || (yield (0, src_1.getSchemaPath)());
            managementUrl = (0, src_1.translateDatasourceUrl)(managementUrl, path_1.default.dirname(schemaPath));
            process.env.MANAGEMENT_URL = managementUrl;
            return managementUrl;
        });
    }
    updateEnvAndSchemaFiles(managementUrl, schemaPath) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log('\n  Updating .env and schema.prisma files...');
            let firstTenantUrl;
            let mustAddDatabaseUrlEnv = false;
            try {
                let schemaFile = yield (0, src_1.readSchemaFile)(schemaPath);
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
                    yield (0, src_1.writeSchemaFile)(schemaFile, schemaPath);
                }
            }
            catch (_c) { }
            let envFile = '';
            try {
                envFile = yield (0, src_1.readEnvFile)(schemaPath);
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
            yield (0, src_1.writeEnvFile)(envFile, schemaPath);
            if (!firstTenantUrl) {
                console.error((0, chalk_1.default) `\n  {red Couldn't find initial datasource url}`);
                return null;
            }
            return {
                name: 'dev',
                url: firstTenantUrl,
            };
        });
    }
    generateClients(schemaPath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n  Generating prisma clients for both management and tenants...');
            yield generate_1.default.generateTenants(schemaPath);
            yield generate_1.default.generateManagement();
        });
    }
    setUpManagement() {
        console.log('\n  Setting up management database...');
        return migrate_1.default.migrateManagement('deploy');
    }
    createFirstTenant(firstTenant, management) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n  Creating first tenant from your initial schema...');
            yield migrate_1.default.migrateTenant('deploy', firstTenant);
            yield generate_1.default.generateTenants();
            yield management.create(firstTenant);
        });
    }
    createExample(firstTenant) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n  Creating example script...');
            const { dmmf } = (0, src_1.requireDistant)('@prisma/client');
            const firstModelMapping = dmmf.mappings.modelOperations[0];
            const modelNamePlural = firstModelMapping.plural;
            const modelNameSingular = firstModelMapping.model.toLowerCase();
            const script = `
      const { PrismaClient } = require('prisma') 
      const { MultiTenant } = require('@prisma-multi-tenant/client')

      // This is the name of your first tenant, try with another one
      const name = "${(firstTenant === null || firstTenant === void 0 ? void 0 : firstTenant.name) || 'dev'}"

      // If you are using TypeScript, you can do "new MultiTenant<PrismaClient>()" for autocompletion
      const multiTenant = new MultiTenant()
      
      async function main() {
        // Prisma-multi-tenant will connect to the correct tenant
        const prisma = await multiTenant.get(name)
      
        // You keep the same interface as before
        const ${modelNamePlural} = await prisma.${modelNameSingular}.findMany()
      
        console.log(${modelNamePlural})
      }

      main()
        .catch(e => console.error(e))
        .finally(async () => {
          await multiTenant.disconnect()
        })
    `
                .split('\n')
                .map((x) => x.substr(6))
                .join('\n')
                .substr(1);
            yield fs_1.default.promises.writeFile(process.cwd() + '/multi-tenancy-example.js', script);
        });
    }
}
exports.default = new Init();
