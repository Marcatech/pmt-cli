import { Management } from 'prisma-multi-tenant-shared-updated';
import { Command, CommandArguments } from '../types';
declare class List implements Command {
    name: string;
    args: never[];
    options: {
        name: string;
        description: string;
        boolean: boolean;
    }[];
    description: string;
    execute(args: CommandArguments, management: Management): Promise<void>;
}
declare const _default: List;
export default _default;
