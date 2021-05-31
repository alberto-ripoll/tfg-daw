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
const User_1 = __importDefault(require("../models/User"));
class EntrenadoresController {
    getEntrenadores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('BOOM NIGGI');
            User_1.default.find({ isEntrenador: true }, { _id: 0, password: 0, rol: 0, rutinas_guardadas: 0, rutinas_recientes: 0, total_Kcal: 0, updatedAt: 0, week_Kcal: 0 }).exec((err, Entrenadores) => {
                if (err) {
                    console.log('error', err);
                }
                if (Entrenadores) {
                    console.log('ENTRENADORES', Entrenadores);
                    res.json(Entrenadores);
                }
            });
        });
    }
    getFiltrados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let entrenadores = yield User_1.default.find({ isEntrenador: true }, { especialidad: 1, ciudad: 1, rate: 1, status: 1, profile_pic: 1, username: 1 });
            let array_filtros = JSON.parse(req.params.filtro);
            console.log(array_filtros);
            let entrenadoresEncontrados = [];
            if (array_filtros.stars) {
                entrenadores.forEach(entrenador => {
                    if (entrenador.rate >= array_filtros.stars) {
                        entrenadoresEncontrados.push(entrenador);
                    }
                });
            }
            //Si me envian filtros de especialidad
            if (array_filtros.especialidades.length >= 1) {
                let entrenadoresFiltrados = [];
                entrenadoresEncontrados.forEach(entrenador => {
                    let coincide = false;
                    let especialidad_entrenador = entrenador.especialidad;
                    console.log(entrenador);
                    for (let index = 0; index < array_filtros.especialidades.length; index++) {
                        let especialidad_filtros = array_filtros.especialidades[index];
                        if (especialidad_entrenador.toLowerCase() === especialidad_filtros.toLowerCase()) {
                            coincide = true;
                        }
                    }
                    if (coincide) {
                        entrenadoresFiltrados.push(entrenador);
                    }
                });
                console.log('ENTRENADORES FILTRADOS,', entrenadoresFiltrados);
                return res.json(entrenadoresFiltrados);
            }
            console.log(entrenadoresEncontrados);
            return res.json(entrenadoresEncontrados);
        });
    }
}
const entrenadoresController = new EntrenadoresController();
exports.default = entrenadoresController;
