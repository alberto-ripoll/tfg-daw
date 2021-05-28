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
const database_1 = __importDefault(require("../database"));
const validator_1 = __importDefault(require("validator"));
const nanoid_1 = require("nanoid");
class SalasController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const salas = yield database_1.default.query('SELECT * FROM salas ORDER BY created_at DESC;');
            res.json({ salas });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let sala_data = JSON.parse(req.body.sala);
            let validate_title = !validator_1.default.isEmpty(sala_data.title);
            if (!validate_title) {
                res.json({ status: 'failed', message: 'La sala debe tener un nombre' });
                return;
            }
            let id_sala = nanoid_1.nanoid();
            let sala = {
                id: id_sala,
                title: sala_data.title,
                description: sala_data.description,
                image: 'https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg',
                entrenador: req["userId"],
                tipo: sala_data.tipo,
                link: sala_data.link
            };
            //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
            let imagen = null;
            try {
                imagen = JSON.parse(JSON.stringify(req.file));
            }
            catch (err) {
            }
            if (imagen) {
                sala.image = imagen.location;
            }
            yield database_1.default.query('INSERT INTO salas SET ?', [sala]);
            return res.status(200).json(true);
        });
    }
    getFiltradas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtro = JSON.parse(req.params.filtro);
            console.log(filtro);
            let tipoQuery = '';
            if (filtro.especialidades.length >= 1) {
                tipoQuery = 'WHERE ';
                for (let i = 0; i < filtro.especialidades.length; i++) {
                    tipoQuery += `tipo='${filtro.especialidades[i]}' ||`;
                }
                tipoQuery = tipoQuery.slice(0, -3);
            }
            let query = `SELECT * FROM salas ${tipoQuery};`;
            console.log(query);
            const salas = yield database_1.default.query(query);
            res.json(salas);
        });
    }
}
const salasController = new SalasController();
exports.default = salasController;
