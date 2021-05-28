"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salasController_1 = __importDefault(require("../controllers/salasController"));
const multers3_1 = __importDefault(require("../services/multers3"));
const index_1 = require("../middlewares/index");
class SalasRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', [index_1.authJwt.verifyToken], salasController_1.default.get);
        this.router.post('/', [index_1.authJwt.verifyToken, multers3_1.default.single('image')], salasController_1.default.create);
        this.router.get('/filtrar/:filtro', [index_1.authJwt.verifyToken], salasController_1.default.getFiltradas);
    }
}
const salasRoutes = new SalasRoutes();
exports.default = salasRoutes.router;
