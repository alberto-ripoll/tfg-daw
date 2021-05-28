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
exports.signIn = exports.signUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = __importDefault(require("../secret"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    if (name == '' || username == '' || email == '' || password == '') {
        return res.status(400).json({ message: "Campos vacios" });
    }
    const newUser = new User_1.default({
        name,
        username,
        email,
        password: yield User_1.default.encryptPassword(password),
        pesos: [{ fecha: User_1.default.setDate(), peso: 0 }],
        kcals: [{ fecha: User_1.default.setDate(), kcal: 0 }]
    });
    const savedUser = yield newUser.save();
    console.log(savedUser);
    const token = jsonwebtoken_1.default.sign({ id: savedUser._id }, secret_1.default.SECRET, {
        expiresIn: 86400
    });
    res.json({ token });
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const userFound = yield User_1.default.findOne({ username: req.body.username });
    if (!userFound)
        return res.json({ message: "user-not-found" });
    const pass_match = yield User_1.default.comparePassword(password, userFound.password);
    if (!pass_match) {
        return res.json({ message: 'invalid-password' });
    }
    const token = jsonwebtoken_1.default.sign({ id: userFound._id }, secret_1.default.SECRET, {
        expiresIn: 86400
    });
    res.json({ token });
});
exports.signIn = signIn;
