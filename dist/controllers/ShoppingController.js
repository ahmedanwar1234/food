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
exports.RestaurantById = exports.SearchFoods = exports.GetFoodsIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: true }).sort([['rating', 'descending']]).populate('foods');
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data Not Found" });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: false }).sort([['rating', 'descending']]).limit(3);
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data Not Found" });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: true }).populate('foods');
    if (result.length > 0) {
        let foodReslut = [{ fucker: "asdfa" }];
        result.map((vandor) => {
            const foods = vandor.foods;
            foodReslut.push(...foods.filter(food => {
                return food.readTime < 30 && food;
            }));
        });
        return res.status(200).json(foodReslut);
    }
    return res.status(400).json({ message: "Data Not Found" });
});
exports.GetFoodsIn30Min = GetFoodsIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode, serviceAvailable: true }).populate('foods');
    if (result.length > 0) {
        const foods = [];
        result.map(food => {
            foods.push(...food.foods);
        });
        return res.status(200).json(foods);
    }
    return res.status(400).json({ message: "Data Not Found" });
});
exports.SearchFoods = SearchFoods;
const RestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_1.Vandor.findById(id).sort([['rating', 'descending']]).populate('foods');
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data Not Found" });
});
exports.RestaurantById = RestaurantById;
//# sourceMappingURL=ShoppingController.js.map