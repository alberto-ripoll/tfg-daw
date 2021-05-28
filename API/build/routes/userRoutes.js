"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const userController_1 = __importDefault(require("../controllers/userController"));
const multers3_1 = __importDefault(require("../services/multers3"));
class UsersRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', [index_1.authJwt.verifyToken], userController_1.default.getUsers);
        this.router.get('/myself', [index_1.authJwt.verifyToken], userController_1.default.getSelfInfo);
        this.router.put('/myself', [index_1.authJwt.verifyToken], userController_1.default.completarDatosFisicos);
        this.router.put('/user/:username', [index_1.authJwt.verifyToken, multers3_1.default.single('image')], userController_1.default.updateProfile);
        this.router.post('/user/:username/reviews', [index_1.authJwt.verifyToken, multers3_1.default.single('image')], userController_1.default.sendReview);
        this.router.get('/user/:username/reviews', [index_1.authJwt.verifyToken], userController_1.default.getReviews);
        this.router.get('/user/:username', [index_1.authJwt.verifyToken], userController_1.default.getUser);
        this.router.get('/user/id/:id', [index_1.authJwt.verifyToken], userController_1.default.getUserById);
        this.router.get('/user/guardarRutina/:id', [index_1.authJwt.verifyToken], userController_1.default.guardarRutinas);
        this.router.get('/user/checkIfSaved/:id', [index_1.authJwt.verifyToken], userController_1.default.checkIfSaved);
        this.router.put('/pesos', [index_1.authJwt.verifyToken], userController_1.default.updatePesos);
        this.router.get('/pesos/:intervalo', [index_1.authJwt.verifyToken], userController_1.default.getPesos);
        this.router.put('/kcals', [index_1.authJwt.verifyToken], userController_1.default.updateKcals);
        this.router.get('/kcals/:intervalo', [index_1.authJwt.verifyToken], userController_1.default.getKcals);
        this.router.get('/search/:username', userController_1.default.searchUser);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
