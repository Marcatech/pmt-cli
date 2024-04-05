"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
class Env {
    constructor() {
        this.name = 'env';
        this.args = [
            {
                name: 'name',
                description: 'Name of the tenant you want in your env',
            },
        ];
        this.description = 'Set env variables for a specific tenant';
    }
    async execute(args, management) {
        const [name] = args.args;
        console.log(`\n  Running \`${args.secondary}\` on tenant "${name}"\n`);
        const tenant = await management.read(name);
        process.env.DATABASE_URL = tenant.url;
        (0, prisma_multi_tenant_shared_updated_1.spawnShell)(args.secondary).then((exitCode) => process.exit(exitCode));
    }
}
exports.default = new Env();
