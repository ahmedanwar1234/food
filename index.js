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
const ExpressApp_1 = __importDefault(require("./src/services/ExpressApp"));
const express_1 = __importDefault(require("express"));
const Database_1 = __importDefault(require("./src/services/Database"));
const utility_1 = require("./src/utility");
const config_1 = require("./src/config");
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // E5_65.q.NqBybZP
    const app = (0, express_1.default)();
    app.get('/test', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield (0, utility_1.GenerateSalt)();
        const passwordbc = yield (0, utility_1.GeneratePassword)("password", salt);
        console.log(salt);
        return res.json({ salt, passwordbc });
    }));
    app.get('/test2', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const validatepassowrd = yield (0, utility_1.ValidatePassword)("password", "$2b$10$gnZshKMoK1tyjjagJeCD/OhQtKXrLYnNCtG/QH7EzoNavIkBFObZG", "$2b$10$gnZshKMoK1tyjjagJeCD/O");
        return res.json({ validatepassowrd });
    }));
    yield (0, Database_1.default)();
    yield (0, ExpressApp_1.default)(app);
    app.listen(config_1.PORT, () => {
        console.log(`Listengin to port ${config_1.PORT}`);
    });
});
StartServer();
//# sourceMappingURL=index.js.map