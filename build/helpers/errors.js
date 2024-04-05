"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = void 0;
const chalk_1 = __importDefault(require("chalk"));
const prisma_multi_tenant_shared_updated_1 = require("prisma-multi-tenant-shared-updated");
const printError = (error, args) => {
    if (error.message.match(`Cannot find module '${prisma_multi_tenant_shared_updated_1.clientManagementPath}'`)) {
        error.type = 'missing-client-management';
    }
    if (!error.type) {
        console.log(chalk_1.default.red('Unknown Error!'));
        console.error(error);
        return;
    }
    switch (error.type) {
        case 'unrecognized-command':
            if (!error.data[0]) {
                return missingCommandOrOption();
            }
            return unrecognizedCommandOrOption(args.primaryArgs);
        case 'missing-args':
            return missingArgs(error.data[0]);
        case 'missing-client-management':
            return missingClientManagement();
        case 'tenant-does-not-exist':
            return tenantDoesNotExists(error.data[0]);
        case 'tenant-already-exists':
            return tenantAlreadyExists(error.data[0]);
        case 'unrecognized-migrate-action':
            return unrecognizedMigrateAction(error.data[0].args.join(' '));
        case 'reserved-tenant-name':
            return reservedTenantName(error.data[0]);
        case 'missing-env':
            return missingEnv(error.data[0].name);
        case 'cannot-migrate-save-management':
            return cannotMigrateSaveManagement();
        default:
            console.error(error);
            return;
    }
};
exports.printError = printError;
const messageHelp = 'Run `prisma-multi-tenant --help` to learn how to use this tool';
const messageHelpCommand = (name) => `Run \`prisma-multi-tenant ${name} --help\` to learn how to use this command`;
const messageList = 'Run `prisma-multi-tenant list` to list all existing tenants';
const missingCommandOrOption = () => {
    console.log((0, chalk_1.default) `
  {red Missing <command|option> argument}

  ${messageHelp}
  `);
};
const unrecognizedCommandOrOption = (args) => {
    console.log((0, chalk_1.default) `
  {red Unrecognized <command|option>: "${args.join(' ')}"}

  ${messageHelp}
  `);
};
const missingArgs = (command) => {
    console.log((0, chalk_1.default) `
  {red Missing one or more arguments for {bold ${command.name}}}

  ${messageHelpCommand(command.name)}
  `);
};
const missingClientManagement = () => {
    console.log((0, chalk_1.default) `
  {red No management Client found}

  Run \`prisma-multi-tenant generate\` to fix this error
  `);
};
const tenantDoesNotExists = (name) => {
    console.log((0, chalk_1.default) `
  {red No tenants exists with the name "${name}"}

  ${messageList}
  `);
};
const tenantAlreadyExists = (name) => {
    console.log((0, chalk_1.default) `
  {red A tenant with the name "${name}" already exists}

  ${messageList}
  `);
};
const unrecognizedMigrateAction = (args) => {
    console.log((0, chalk_1.default) `
  {red Unrecognized migrate action "${args}"}

  ${messageHelpCommand('migrate')}
  `);
};
const reservedTenantName = (name) => {
    console.log((0, chalk_1.default) `
  {red You cannot use "${name}" for the name of a tenant}
  `);
};
const missingEnv = (name) => {
    console.log((0, chalk_1.default) `
  {red The env variable "${name}" is required but missing}
  `);
};
const cannotMigrateSaveManagement = () => {
    console.log((0, chalk_1.default) `
  {red You cannot \`migrate save\` on the management datasource}
  `);
};
