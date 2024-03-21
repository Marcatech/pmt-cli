import { Command } from '../types';
declare class Eject implements Command {
    name: string;
    args: never[];
    description: string;
    execute(): Promise<void>;
}
declare const _default: Eject;
export default _default;
