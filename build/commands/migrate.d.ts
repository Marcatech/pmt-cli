/// <reference types="node" />
import { Datasource, Management } from 'prisma-multi-tenant-shared-updated';
import { Command, CommandArguments } from '../types';
declare class Migrate implements Command {
    name: string;
    args: {
        name: string;
        optional: boolean;
        description: string;
    }[];
    options: {
        name: string;
        description: string;
    }[];
    description: string;
    execute(args: CommandArguments, management: Management): Promise<void>;
    parseArgs(args: CommandArguments): {
        name: string | undefined;
        action: string;
        prismaArgs: string;
    };
    migrateOneTenant(management: Management, action: string, name: string, schemaPath?: string, prismaArgs?: string): Promise<string | Buffer>;
    migrateAllTenants(management: Management, action: string, schemaPath?: string, prismaArgs?: string): Promise<void>;
    migrateTenant(action: string, tenant?: Datasource, schemaPath?: string, prismaArgs?: string): Promise<string | Buffer>;
    migrateManagement(action: string, prismaArgs?: string): Promise<string | Buffer>;
    generatePrismaClient(schemaPath?: string): Promise<string | Buffer>;
}
declare const _default: Migrate;
export default _default;
