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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const models_1 = require("../models");
const utility_1 = require("../utility");
const NotificationUtility_1 = require("../utility/NotificationUtility");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password, phone } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const passwordbcrypt = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, NotificationUtility_1.GenerateOtp)();
    const existCustomer = yield models_1.Customer.findOne({ email });
    if (existCustomer !== null) {
        return res.status(409).json({ message: 'An user exist with the provide email ID' });
    }
    const result = yield models_1.Customer.create({
        email,
        password: passwordbcrypt,
        salt,
        phone,
        otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        verified: false,
        lat: 0,
        lng: 0
    });
    if (result) {
        // send the OTP customer
        yield (0, NotificationUtility_1.onRequestOTP)(otp, phone);
        // generate the signature
        const signature = (0, utility_1.GenerateSingature)({ _id: result._id, verified: result.verified, email: result.email });
        // send the result to client
        return res.status(201).json({ signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ message: "Error with signup" });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            //generate the signature
            const signature = (0, utility_1.GenerateSingature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            // send the result to cilent
            return res.status(201).json({ signature, verified: customer.verified, email: customer.email });
        }
    }
    return res.status(400).json({ message: "Login error" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = yield profile.save();
                const signature = (0, utility_1.GenerateSingature)({ _id: updateCustomerResponse._id, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email });
                return res.status(201).json({ signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email });
            }
        }
    }
    return res.status(400).json({ message: 'Error with OTP VALIDATION' });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, NotificationUtility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, NotificationUtility_1.onRequestOTP)(otp, profile.phone);
            return res.status(200).json({ message: "OTP sent your registred phone number!" });
        }
    }
    return res.status(200).json({ message: "Error with Request OTP" });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const custoemr = req.user;
    if (custoemr) {
        const profile = yield models_1.Customer.findById(custoemr._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(200).json({ message: "Error with Fetch Profile" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const custoemr = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: true } });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (custoemr) {
        const profile = yield models_1.Customer.findById(custoemr._id);
        if (profile) {
            {
                firstName != null && (profile.firstName = firstName);
            }
            ;
            {
                lastName != null && (profile.lastName = lastName);
            }
            ;
            {
                address != null && (profile.address = address);
            }
            ;
            const reslut = yield profile.save();
            res.status(200).json(reslut);
        }
    }
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map