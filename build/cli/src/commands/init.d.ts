/// <reference types="node" />
import { Datasource, Management } from '../../../shared/src';
import { Command, CommandArguments } from '../types';
declare class Init implements Command {
    name: string;
    args: never[];
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
    installPMT(): Promise<void>;
    getManagementDatasource(args: CommandArguments): Promise<string>;
    updateEnvAndSchemaFiles(managementUrl: string, schemaPath?: string): Promise<Datasource | null>;
    generateClients(schemaPath?: string): Promise<void>;
    setUpManagement(): Promise<string | Buffer>;
    createFirstTenant(firstTenant: Datasource, management: Management): Promise<void>;
    createExample(firstTenant: Datasource | null): Promise<void>;
}
declare const _default: Init;
export default _default;
