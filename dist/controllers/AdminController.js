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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVandorById = exports.GetVandors = exports.CreateVandor = exports.findVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const findVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.findVandor = findVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, pincode, foodType, email, ownerName, password, phone } = req.body;
        console.log(password);
        const existingVandor = yield (0, exports.findVandor)('', email);
        if (existingVandor !== null) {
            return res.json({ "message": "A vandor is existi with this email ID" });
        }
        // generated a salt
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        // encrypt the password using the salt
        const createVandor = yield models_1.Vandor.create({
            name, address, pincode, foodType, email, ownerName, password: userPassword, salt: salt,
            phone, rating: 0, serviceAvailable: false, coverImages: [], foods: []
        });
        return res.json(createVandor);
    }
    catch (error) {
        next(error);
    }
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    if (vandors !== null) {
        return res.json(vandors);
    }
    return res.json({ message: "vandors data not available" });
});
exports.GetVandors = GetVandors;
const GetVandorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    const vandor = yield (0, exports.findVandor)(vandorId);
    if (vandor !== null) {
        return res.json({ message: "success find", vandor });
    }
    res.json({ message: "fucker vandor by id not found" });
});
exports.GetVandorById = GetVandorById;
//# sourceMappingURL=AdminController.js.map