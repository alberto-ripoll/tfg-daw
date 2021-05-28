"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const friendsController_1 = __importDefault(require("../controllers/friendsController"));
class FriendsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', [index_1.authJwt.verifyToken], friendsController_1.default.getFriends);
        this.router.put('/', [index_1.authJwt.verifyToken], friendsController_1.default.addFriend);
        // this.router.get('/user/:id',[authJwt.verifyToken], userController.getUser)
        // this.router.post('/', [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkRoles], userController.createUser)
        // this.router.delete('/user/:id', userController.deleteUser)
    }
}
const friendsRoutes = new FriendsRoutes();
exports.default = friendsRoutes.router;
