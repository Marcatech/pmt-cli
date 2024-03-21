import chalk from 'chalk';
import {
  Datasource,
  Management,
  PmtError,
  runDistantPrisma,
  runLocalPrisma,
  spawnShell,
  getSchemaPath,
} from '../../../shared/src';
import { Command, CommandArguments } from '../types';

class Migrate implements Command {
  name = 'migrate';
  args = [
    {
      name: 'name',
      optional: true,
      description: 'Name of the tenant you want to migrate',
    },
    {
      name: 'action',
      optional: false,
      description: 'Migrate "dev", "deploy" or "generate" the tenant',
    },
  ];
  options = [
    {
      name: 'schema',
      description: 'Specify path of schema',
    },
  ];
  description = 'Migrate tenants (dev, deploy, generate)';

  async execute(args: CommandArguments, management: Management) {
    const { name, action, prismaArgs } = this.parseArgs(args);

    if (action === 'generate') {
      await this.generatePrismaClient(args.options.schema);
      return;
    }

    // Migrate up or down on all tenants or a specific tenant
    if (!name) {
      console.log(`\n  Migrating ${action} all tenants...\n`);
      await this.migrateAllTenants(management, action, args.options.schema, prismaArgs);
    } else if (name === 'management') {
      console.log(`\n  Migrating management ${action}...`);
      await this.migrateManagement(action, prismaArgs);
    } else {
      console.log(`\n  Migrating "${name}" ${action}...`);
      await this.migrateOneTenant(management, action, name, args.options.schema, prismaArgs);
    }
  }

  parseArgs(args: CommandArguments) {
    const [arg1, arg2, ...restArgs] = args.args;

    let name, action, prismaArgs;

    if (['dev', 'deploy', 'generate'].includes(arg2)) {
      name = arg1;
      action = arg2;
      prismaArgs = restArgs.join(' ');
    } else if (['dev', 'deploy', 'generate'].includes(arg1)) {
      action = arg1;
      prismaArgs = [arg2, ...restArgs].join(' ');
    } else {
      throw new PmtError('unrecognized-migrate-action', args);
    }

    return { name, action, prismaArgs };
  }

  async migrateOneTenant(
    management: Management,
    action: string,
    name: string,
    schemaPath?: string,
    prismaArgs = ''
  ) {
    const tenant = await management.read(name);
    return this.migrateTenant(action, tenant, schemaPath, prismaArgs);
  }

  async migrateAllTenants(
    management: Management,
    action: string,
    schemaPath?: string,
    prismaArgs = ''
  ) {
    const tenants = await management.list();

    for (const tenant of tenants) {
      console.log(`    > Migrating "${tenant.name}" ${action}`);
      await this.migrateTenant(action, tenant, schemaPath, prismaArgs);
    }
  }

  async migrateTenant(
    action: string,
    tenant?: Datasource,
    schemaPath?: string,
    prismaArgs = ''
  ) {
    schemaPath = schemaPath || (await getSchemaPath());
    return runDistantPrisma(`migrate ${action} --schema ${schemaPath} ${prismaArgs}`, tenant);
  }

  migrateManagement(action: string, prismaArgs = '') {
    return runLocalPrisma(`migrate ${action} ${prismaArgs}`);
  }

  async generatePrismaClient(schemaPath?: string) {
    schemaPath = schemaPath || (await getSchemaPath());
    return runLocalPrisma(`generate --schema ${schemaPath}`);
  }
}

export default new Migrate();
