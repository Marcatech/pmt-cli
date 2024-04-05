"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const chalk_1 = __importDefault(require("chalk"));
class Studio {
    constructor() {
        this.name = 'studio';
        this.args = [
            {
                name: 'name',
                optional: false,
                description: 'Name of the tenant you want to access',
            },
        ];
        this.options = [
            {
                name: 'port',
                altNames: ['p'],
                description: 'Port to start Studio on',
            },
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
        ];
        this.description = 'Use Studio to access a tenant';
    }
    async execute(args, management) {
        const [name] = args.args;
        const port = args.options.port || '5555';
        console.log(`\n  Studio started for tenant "${name}" at http://localhost:${port}\n`);
        const tenant = await management.read(name);
        try {
            const schemaPath = args.options.schema || (await (0, prisma_multi_tenant_shared_updated_1.getSchemaPath)());
            await (0, prisma_multi_tenant_shared_updated_1.runDistantPrisma)(`studio --port ${port} --schema ${schemaPath} ${args.secondary} --experimental`, tenant, false);
        }
        catch (err) {
            if (err.message.includes('EADDRINUSE') || err.code === 7) {
                console.log(chalk_1.default.red(`  The port for studio is already being used, try another one:`));
                console.log(`  > prisma-multi-tenant studio ${name} --port ${Number(port) + 1}\n`);
            }
            else {
                throw err;
            }
        }
    }
}
exports.default = new Studio();
