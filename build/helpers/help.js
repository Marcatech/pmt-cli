"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commands = __importStar(require("../commands"));
const printGlobalHelp = () => {
    console.log((0, chalk_1.default) `
  {bold.cyan 🧭  prisma-multi-tenant} {grey v_custom}
  
  {bold USAGE}

    {bold.italic prisma-multi-tenant} [command] [args]
    
    {grey Examples:}
        {grey prisma-multi-tenant new}
        {grey prisma-multi-tenant migrate my_tenant up}
        {grey prisma-multi-tenant env my_tenant -- npx @prisma/cli introspect}
        {grey ...}

  {bold COMMANDS}
    
${Object.values(commands)
        .map((command) => {
        const args = command.args
            .filter((arg) => !arg.secondary)
            .map((arg) => `<${arg.name + (arg.optional ? '?' : '')}>`)
            .join(' ');
        const strLength = command.name.length + args.length;
        const spaceBetween = ''.padStart(24 - strLength);
        return (0, chalk_1.default) `    {bold ${command.name}} ${args} ${spaceBetween} ${command.description}`;
    })
        .join('\n')}

  {bold OPTIONS}

    {bold -h, --help}                 Output usage information for a command
    {bold -v, --version}              Output the version number
    {bold -e, --env}                  Load env file given as parameter
    {bold --verbose}                  Print additional logs
  `);
    process.exit(0);
};
const printCommandHelp = (command) => {
    console.log((0, chalk_1.default) `
  {bold.cyan 🧭  prisma-multi-tenant} {bold.yellow ${command.name}}

    ${command.description}

  {bold USAGE}

    {bold.italic prisma-multi-tenant} ${command.name}${command.args.length > 0 ? ' ' : ''}${command.args
        .map((arg) => `${arg.secondary ? '<' : '['}${arg.name + (arg.optional ? '?' : '')}${arg.secondary ? '>' : ']'}`)
        .join(' ')}${command.options
        ? ' (' +
            command.options
                .map((option) => `--${option.name}` + (option.boolean ? '' : `=[${option.name}]`))
                .join(' ') +
            ')'
        : ''}
  `);
    if (command.args.length > 0) {
        console.log((0, chalk_1.default) `
  {bold ARGS}

${command.args
            .map((arg) => {
            const argStr = arg.name.replace(/\|/g, ', ');
            const strLength = argStr.length;
            const spaceBetween = ''.padStart(15 - strLength);
            return (0, chalk_1.default) `    {bold ${argStr}} ${spaceBetween} ${arg.description} ${arg.optional ? (0, chalk_1.default) `{italic.grey (optional)}` : ''}`;
        })
            .join('\n')}
    `);
    }
    console.log((0, chalk_1.default) `\n  {bold OPTIONS}`);
    if (command.options && command.options.length > 0) {
        console.log('\n' +
            command.options
                .map((option) => {
                const strLength = option.name.length;
                const spaceBetween = ''.padStart(13 - strLength);
                return (0, chalk_1.default) `    {bold --${option.name}} ${spaceBetween} ${option.description}`;
            })
                .join('\n'));
    }
    console.log((0, chalk_1.default) `
    {bold -h, --help}       Display this help
    {bold -e, --env}        Load env file given as parameter
    {bold --verbose}        Print additional logs
  `);
};
const printGlobalVersion = () => {
    console.log("custom");
};
exports.default = {
    printGlobalHelp,
    printCommandHelp,
    printGlobalVersion,
};
