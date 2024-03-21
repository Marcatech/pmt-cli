import { Datasource } from '../../../shared/src';
import { CommandArguments } from '../types';
declare const _default: {
    confirm: (message: string) => Promise<boolean>;
    managementConf: (args: CommandArguments) => Promise<{
        url: string;
    }>;
    tenantConf: (args: CommandArguments) => Promise<Datasource>;
};
export default _default;
