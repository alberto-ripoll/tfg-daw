"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lineasRutinaController_1 = __importDefault(require("../controllers/lineasRutinaController"));
const multers3_1 = __importDefault(require("../services/multers3"));
class LineasRutinaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:id_rutina', lineasRutinaController_1.default.get);
        this.router.get('/:id_rutina/:id_linea', lineasRutinaController_1.default.getOne);
        this.router.post('/:id_rutina', multers3_1.default.single('image'), lineasRutinaController_1.default.create);
        this.router.put('/:id_rutina/:id_linea', lineasRutinaController_1.default.update);
        this.router.delete('/:id_rutina', lineasRutinaController_1.default.deleteAll);
        this.router.delete('/:id_rutina/:id_linea', lineasRutinaController_1.default.deleteOne);
    }
}
const lineasRutinaRoutes = new LineasRutinaRoutes();
exports.default = lineasRutinaRoutes.router;
