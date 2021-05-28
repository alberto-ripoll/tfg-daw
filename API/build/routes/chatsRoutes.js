"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const chatController_1 = __importDefault(require("../controllers/chatController"));
class ChatRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:friend', [index_1.authJwt.verifyToken], chatController_1.default.getMessages);
        this.router.post('/:friend', [index_1.authJwt.verifyToken], chatController_1.default.sendMessage);
    }
}
const chatRoutes = new ChatRoutes();
exports.default = chatRoutes.router;
