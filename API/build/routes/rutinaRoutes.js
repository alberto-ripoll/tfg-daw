"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rutinasController_1 = __importDefault(require("../controllers/rutinasController"));
const multers3_1 = __importDefault(require("../services/multers3"));
const index_1 = require("../middlewares/index");
class RutinasRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', rutinasController_1.default.get);
        this.router.get('/creadas/:username', [index_1.authJwt.verifyToken], rutinasController_1.default.getCreadas);
        // this.router.get('/guardadas',[authJwt.verifyToken], rutinasController.getGuardadas)
        this.router.get('/filtrar/:filtro', [index_1.authJwt.verifyToken], rutinasController_1.default.getFiltradas);
        this.router.get('/filtrarusuario/:filtro', [index_1.authJwt.verifyToken], rutinasController_1.default.getFiltradasUsu);
        this.router.get('/search/:searchString', rutinasController_1.default.search);
        this.router.get('/:id', rutinasController_1.default.getOne);
        this.router.post('/', [index_1.authJwt.verifyToken, multers3_1.default.single('image')], rutinasController_1.default.create);
        this.router.put('/:id', [index_1.authJwt.verifyToken], rutinasController_1.default.update);
        this.router.delete('/:id', [index_1.authJwt.verifyToken], rutinasController_1.default.delete);
    }
}
const rutinasRoutes = new RutinasRoutes();
exports.default = rutinasRoutes.router;
