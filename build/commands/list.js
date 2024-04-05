"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
class List {
    constructor() {
        this.name = 'list';
        this.args = [];
        this.options = [
            {
                name: 'json',
                description: 'Print using JSON format',
                boolean: true,
            },
        ];
        this.description = 'List all tenants';
    }
    async execute(args, management) {
        if (!args.options.json) {
            console.log('\n  Fetching available tenants...');
        }
        const tenants = await management.list();
        if (args.options.json) {
            console.log(JSON.stringify(tenants, null, 2));
            return;
        }
        const table = new cli_table3_1.default({
            head: [chalk_1.default.green.bold('Name'), chalk_1.default.green('URL')],
        });
        for (const tenant of tenants) {
            table.push([
                tenant.name,
                tenant.url.length > 25
                    ? tenant.url.substr(0, 11) + '...' + tenant.url.substr(-11)
                    : tenant.url,
            ]);
        }
        console.log((0, chalk_1.default) `\n  {green.bold List of available tenants}
      ${'\n' + table.toString()}
    `);
    }
}
exports.default = new List();
