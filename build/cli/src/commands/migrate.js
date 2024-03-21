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
    execute(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, action, prismaArgs } = this.parseArgs(args);
            if (action === 'generate') {
                yield this.generatePrismaClient(args.options.schema);
                return;
            }
            if (!name) {
                console.log(`\n  Migrating ${action} all tenants...\n`);
                yield this.migrateAllTenants(management, action, args.options.schema, prismaArgs);
            }
            else if (name === 'management') {
                console.log(`\n  Migrating management ${action}...`);
                yield this.migrateManagement(action, prismaArgs);
            }
            else {
                console.log(`\n  Migrating "${name}" ${action}...`);
                yield this.migrateOneTenant(management, action, name, args.options.schema, prismaArgs);
            }
        });
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
            throw new src_1.PmtError('unrecognized-migrate-action', args);
        }
        return { name, action, prismaArgs };
    }
    migrateOneTenant(management_1, action_1, name_1, schemaPath_1) {
        return __awaiter(this, arguments, void 0, function* (management, action, name, schemaPath, prismaArgs = '') {
            const tenant = yield management.read(name);
            return this.migrateTenant(action, tenant, schemaPath, prismaArgs);
        });
    }
    migrateAllTenants(management_1, action_1, schemaPath_1) {
        return __awaiter(this, arguments, void 0, function* (management, action, schemaPath, prismaArgs = '') {
            const tenants = yield management.list();
            for (const tenant of tenants) {
                console.log(`    > Migrating "${tenant.name}" ${action}`);
                yield this.migrateTenant(action, tenant, schemaPath, prismaArgs);
            }
        });
    }
    migrateTenant(action_1, tenant_1, schemaPath_1) {
        return __awaiter(this, arguments, void 0, function* (action, tenant, schemaPath, prismaArgs = '') {
            schemaPath = schemaPath || (yield (0, src_1.getSchemaPath)());
            return (0, src_1.runDistantPrisma)(`migrate ${action} --schema ${schemaPath} ${prismaArgs}`, tenant);
        });
    }
    migrateManagement(action, prismaArgs = '') {
        return (0, src_1.runLocalPrisma)(`migrate ${action} ${prismaArgs}`);
    }
    generatePrismaClient(schemaPath) {
        return __awaiter(this, void 0, void 0, function* () {
            schemaPath = schemaPath || (yield (0, src_1.getSchemaPath)());
            return (0, src_1.runLocalPrisma)(`generate --schema ${schemaPath}`);
        });
    }
}
exports.default = new Migrate();
