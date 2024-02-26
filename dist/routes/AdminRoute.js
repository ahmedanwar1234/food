"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vandor', controllers_1.CreateVandor).
    get('/vandors', controllers_1.GetVandors)
    .get('/vandor/:id', controllers_1.GetVandorById);
router.get('/', (req, res, next) => {
    res.json({ message: "hello fucker mother admin router" });
});
//# sourceMappingURL=AdminRoute.js.map