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
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const src_1 = require("../../../shared/src");
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
    execute(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.args[0] === 'management') {
                yield this.newManagement(args);
            }
            else {
                yield this.newTenant(args, management);
            }
        });
    }
    newManagement(args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log();
            const { url: databaseUrl } = yield prompt_1.default.managementConf(args);
            const schemaPath = args.options.schema || (yield (0, src_1.getSchemaPath)());
            process.env.MANAGEMENT_URL = (0, src_1.translateDatasourceUrl)(databaseUrl, path_1.default.dirname(schemaPath));
            yield migrate_1.default.migrateManagement('deploy', '');
            console.log((0, chalk_1.default) `\n✅  {green Successfully created a new management database!}\n`);
        });
    }
    newTenant(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log();
            const tenant = yield prompt_1.default.tenantConf(args);
            if (tenant.name === 'management') {
                throw new src_1.PmtError('reserved-tenant-name', 'management');
            }
            yield migrate_1.default.migrateTenant('deploy', tenant, args.options.schema, '');
            if (args.options['no-management']) {
                console.log((0, chalk_1.default) `\n✅  {green Created the new tenant (without management) and migrated up the database}\n`);
                return;
            }
            yield management.create(tenant);
            console.log((0, chalk_1.default) `\n✅  {green Registered the new tenant into management and migrated up the database!}\n`);
        });
    }
}
exports.default = new New();
