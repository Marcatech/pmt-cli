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
exports.useYarn = void 0;
const path_1 = __importDefault(require("path"));
const src_1 = require("../../../shared/src");
const useYarn = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, src_1.fileExists)(path_1.default.join(process.cwd(), 'yarn.lock'))) {
        return true;
    }
    if (yield (0, src_1.fileExists)(path_1.default.join(process.cwd(), '../yarn.lock'))) {
        return true;
    }
    return false;
});
exports.useYarn = useYarn;
