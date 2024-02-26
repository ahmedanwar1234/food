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
exports.GetFoods = exports.AddFood = exports.UpdateVandorServices = exports.UpdateVandorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const Food_1 = require("../models/Food");
const utility_1 = require("../utility");
const AdminController_1 = require("./AdminController");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, AdminController_1.findVandor)('', email);
    if (existingVandor !== null) {
        // validation adn give access4
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSingature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType,
                name: existingVandor.name
            });
            return res.json(signature);
        }
        else {
            return res.json({ "message": "password is not valid" });
        }
    }
    return res.json({ "message": "Login cerdential not valid" });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ message: "vandor information not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodType, name, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.name = (name ? name : existingVandor.name);
            existingVandor.phone = phone;
            existingVandor.foodType = foodType;
            existingVandor.address = address;
            const savedResult = yield existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ message: "vandor information not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, AdminController_1.findVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            console.log(req.files);
            const images = files === null || files === void 0 ? void 0 : files.map((file) => {
                return file.filename;
            });
            vandor.coverImages.push(...images);
            // add relation food in vandor mongoose add _id food to vandor automaticly
            const result = yield vandor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "somthing went wrong with add food" });
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const UpdateVandorServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const savedResult = yield existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ message: "vandor information not found" });
});
exports.UpdateVandorServices = UpdateVandorServices;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readTime, price } = req.body;
        const vandor = yield (0, AdminController_1.findVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => {
                return file.filename;
            });
            console.log(images);
            const createFood = yield Food_1.Food.create({
                vandorId: vandor._id,
                name,
                category,
                description,
                foodType,
                images: images,
                rating: 0,
                price,
                readTime
            });
            // add relation food in vandor mongoose add _id food to vandor automaticly
            vandor.foods.push(createFood);
            const result = yield vandor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "somthing went wrong with add food" });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield Food_1.Food.find({ vandorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "foods information not found" });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VandorController.js.map