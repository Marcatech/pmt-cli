import { Management } from '../../../shared/src';
import { Command, CommandArguments } from '../types';
declare class Env implements Command {
    name: string;
    args: {
        name: string;
        description: string;
    }[];
    description: string;
    execute(args: CommandArguments, management: Management): Promise<void>;
}
declare const _default: Env;
export default _default;
