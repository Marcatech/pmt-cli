"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const confirm = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { confirm } = yield inquirer_1.default.prompt([
        {
            name: 'confirm',
            type: 'confirm',
            message,
            default: false,
        },
    ]);
    return confirm;
});
const askQuestion = (question) => __awaiter(void 0, void 0, void 0, function* () {
    if (question.value) {
        if (!question.choices || (question.choices && question.choices.includes(question.value))) {
            console.log((0, chalk_1.default) `  {bold ${question.message}} {blueBright ${question.value}}`);
            return question.value;
        }
    }
    return (yield inquirer_1.default.prompt([question]))[question.name];
});
const askQuestions = (questions) => __awaiter(void 0, void 0, void 0, function* () {
    const answers = {};
    for (const question of questions) {
        answers[question.name] = yield askQuestion(question);
    }
    if (questions.filter((q) => !q.value).length > 0) {
        console.log();
        if (!(yield confirm('Are you sure of your inputs?'))) {
            process.exit(0);
        }
    }
    return answers;
});
const managementConf = (args) => __awaiter(void 0, void 0, void 0, function* () {
    return askQuestions([
        {
            name: 'url',
            message: 'Management database url:',
            type: 'input',
            value: args.options.url,
        },
    ]);
});
const tenantConf = (args) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.default = { confirm, managementConf, tenantConf };
