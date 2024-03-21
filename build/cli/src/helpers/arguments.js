"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldLoadEnv = exports.shouldSetVerbose = exports.shouldPrintVersion = exports.shouldPrintHelp = exports.convertToCommandArgs = exports.parseArgs = void 0;
const arg_1 = __importDefault(require("arg"));
const src_1 = require("../../../shared/src");
const parseArgs = () => {
    const argv = process.argv.slice(2);
    const [rawPrimaryArgs, ...rawRestArgs] = argv.join(' ').split(' -- ');
    const primaryArgs = rawPrimaryArgs.trim().split(' ');
    const secondaryArgs = rawRestArgs.join(' -- ');
    const parsedPrimaryArgs = (0, arg_1.default)({
        '--help': Boolean,
        '--version': Boolean,
        '--verbose': Boolean,
        '--env': String,
        '-h': '--help',
        '-v': '--version',
        '-e': '--env',
    }, { permissive: true, argv: primaryArgs });
    const commandName = primaryArgs.filter((a) => !a.startsWith('-'))[0];
    return {
        argv,
        primaryArgs,
        secondaryArgs,
        parsedPrimaryArgs,
        commandName,
    };
};
exports.parseArgs = parseArgs;
const convertToCommandArgs = (command, { parsedPrimaryArgs: { _ }, secondaryArgs }) => {
    const spec = (command.options || []).reduce((acc, option) => {
        acc['--' + option.name] = option.boolean ? Boolean : String;
        for (const altName of option.altNames || []) {
            acc['-' + altName] = option.boolean ? Boolean : String;
        }
        return acc;
    }, {});
    const parsed = (0, arg_1.default)(spec, { permissive: true, argv: _ });
    const options = (command.options || []).reduce((acc, { name, altNames = [] }) => {
        if (parsed['--' + name]) {
            acc[name] = parsed['--' + name];
        }
        for (const altName of altNames) {
            if (parsed['-' + altName]) {
                acc[name] = parsed['-' + altName];
            }
        }
        return acc;
    }, {});
    const args = parsed._.slice(1);
    if (command.args.filter((a) => !a.optional).length > args.length) {
        throw new src_1.PmtError('missing-args', command);
    }
    return {
        args,
        options,
        secondary: secondaryArgs,
    };
};
exports.convertToCommandArgs = convertToCommandArgs;
const shouldPrintHelp = ({ commandName, parsedPrimaryArgs }) => {
    if (commandName == 'help')
        return true;
    if (parsedPrimaryArgs['--help'] && parsedPrimaryArgs._.length == 0)
        return true;
    return false;
};
exports.shouldPrintHelp = shouldPrintHelp;
const shouldPrintVersion = ({ parsedPrimaryArgs }) => {
    return parsedPrimaryArgs['--version'] || false;
};
exports.shouldPrintVersion = shouldPrintVersion;
const shouldSetVerbose = ({ parsedPrimaryArgs }) => {
    return parsedPrimaryArgs['--verbose'] || false;
};
exports.shouldSetVerbose = shouldSetVerbose;
const shouldLoadEnv = ({ parsedPrimaryArgs }) => {
    return !!parsedPrimaryArgs['--env'];
};
exports.shouldLoadEnv = shouldLoadEnv;
