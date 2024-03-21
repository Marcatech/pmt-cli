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
const src_1 = require("../../../shared/src");
const chalk_1 = __importDefault(require("chalk"));
class Studio {
    constructor() {
        this.name = 'studio';
        this.args = [
            {
                name: 'name',
                optional: false,
                description: 'Name of the tenant you want to access',
            },
        ];
        this.options = [
            {
                name: 'port',
                altNames: ['p'],
                description: 'Port to start Studio on',
            },
            {
                name: 'schema',
                description: 'Specify path of schema',
            },
        ];
        this.description = 'Use Studio to access a tenant';
    }
    execute(args, management) {
        return __awaiter(this, void 0, void 0, function* () {
            const [name] = args.args;
            const port = args.options.port || '5555';
            console.log(`\n  Studio started for tenant "${name}" at http://localhost:${port}\n`);
            const tenant = yield management.read(name);
            try {
                const schemaPath = args.options.schema || (yield (0, src_1.getSchemaPath)());
                yield (0, src_1.runDistantPrisma)(`studio --port ${port} --schema ${schemaPath} ${args.secondary} --experimental`, tenant, false);
            }
            catch (err) {
                if (err.message.includes('EADDRINUSE') || err.code === 7) {
                    console.log(chalk_1.default.red(`  The port for studio is already being used, try another one:`));
                    console.log(`  > prisma-multi-tenant studio ${name} --port ${Number(port) + 1}\n`);
                }
                else {
                    throw err;
                }
            }
        });
    }
}
exports.default = new Studio();
