import { Management } from 'prisma-multi-tenant-shared-updated';
import { Command, CommandArguments } from '../types';
declare class New implements Command {
    name: string;
    altNames: string[];
    args: {
        name: string;
        optional: boolean;
        description: string;
    }[];
    options: ({
        name: string;
        description: string;
        boolean?: undefined;
    } | {
        name: string;
        description: string;
        boolean: boolean;
    })[];
    description: string;
    execute(args: CommandArguments, management: Management): Promise<void>;
    newManagement(args: CommandArguments): Promise<void>;
    newTenant(args: CommandArguments, management: Management): Promise<void>;
}
declare const _default: New;
export default _default;
