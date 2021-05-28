"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const userController_1 = __importDefault(require("../controllers/userController"));
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', userController_1.default.getUsers);
        this.router.get('/user/:id', [index_1.authJwt.verifyToken], userController_1.default.getUser);
        this.router.post('/', [index_1.authJwt.verifyToken, index_1.authJwt.isAdmin, index_1.verifySignUp.checkRoles], userController_1.default.createUser);
        this.router.delete('/user/:id', userController_1.default.deleteUser);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
