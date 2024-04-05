import { Command } from '../types';
declare class Help implements Command {
    name: string;
    args: never[];
    description: string;
    execute(): Promise<void>;
}
declare const _default: Help;
export default _default;
