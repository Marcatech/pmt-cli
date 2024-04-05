"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const confirm = async (message) => {
    const { confirm } = await inquirer_1.default.prompt([
        {
            name: 'confirm',
            type: 'confirm',
            message,
            default: false,
        },
    ]);
    return confirm;
};
const askQuestion = async (question) => {
    if (question.value) {
        if (!question.choices || (question.choices && question.choices.includes(question.value))) {
            console.log((0, chalk_1.default) `  {bold ${question.message}} {blueBright ${question.value}}`);
            return question.value;
        }
    }
    return (await inquirer_1.default.prompt([question]))[question.name];
};
const askQuestions = async (questions) => {
    const answers = {};
    for (const question of questions) {
        answers[question.name] = await askQuestion(question);
    }
    if (questions.filter((q) => !q.value).length > 0) {
        console.log();
        if (!(await confirm('Are you sure of your inputs?'))) {
            process.exit(0);
        }
    }
    return answers;
};
const managementConf = async (args) => {
    return askQuestions([
        {
            name: 'url',
            message: 'Management database url:',
            type: 'input',
            value: args.options.url,
        },
    ]);
};
const tenantConf = async (args) => {
    return askQuestions([
        {
            name: 'name',
            message: 'Name of the tenant:',
            type: 'input',
            value: args.options.name,
        },
        {
            name: 'url',
            message: 'Database url:',
            type: 'input',
            value: args.options.url,
        },
    ]);
};
exports.default = { confirm, managementConf, tenantConf };
