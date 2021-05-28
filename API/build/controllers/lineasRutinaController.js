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
class LineasRutinaController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rutina } = req.params;
            const lineas_rutina = yield database_1.default.query('SELECT * FROM lineas_rutina WHERE id_rutina = ?', [id_rutina]);
            res.json(lineas_rutina);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rutina } = req.params;
            const { id_linea } = req.params;
            const rutina = yield database_1.default.query("SELECT * FROM lineas_rutina WHERE id_rutina = ? && id_linea_rutina = ?", [id_rutina, id_linea]);
            if (rutina.length > 0) {
                return res.json(rutina[0]);
            }
            res.status(404).json({ message: 'La linea rutina no existe' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('AQUI ENTRO');
            const { id_rutina } = req.params;
            const num_linea = req.body.num_linea;
            const ejercicio = JSON.parse(req.body.linearutina);
            let linea_rutina = {
                id_rutina: id_rutina,
                num_linea_rutina: num_linea,
                ejercicio: ejercicio.ejercicio,
                repeticiones: ejercicio.repeticiones,
                series: ejercicio.series,
                descanso: ejercicio.descanso,
                imagen: 'https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg'
            };
            //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
            let imagen = null;
            try {
                imagen = JSON.parse(JSON.stringify(req.file));
            }
            catch (err) {
            }
            if (imagen) {
                linea_rutina.imagen = imagen.location;
            }
            yield database_1.default.query('INSERT INTO lineas_rutina SET ?', [linea_rutina]);
            res.json({ message: 'linea rutina almacenada' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rutina } = req.params;
            const { id_linea } = req.params;
            try {
                yield database_1.default.query('UPDATE lineas_rutina set ? WHERE id_rutina = ? && num_linea_rutina = ?', [req.body, id_rutina, id_linea]);
                res.json({ message: 'Rutina' + id_rutina + 'actualizada la linea rutina ' + id_linea });
            }
            catch (err) {
                console.log("NO Funciono");
                console.log(err);
            }
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rutina } = req.params;
            const { id_linea } = req.params;
            yield database_1.default.query('DELETE FROM lineas_rutina WHERE id_rutina = ? && id_linea_rutina = ?', [req.body, id_rutina, id_linea]);
            res.json({ message: 'Rutina eliminada' });
        });
    }
    deleteAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rutina } = req.params;
            yield database_1.default.query('DELETE FROM lineas_rutina WHERE id_rutina = ?', [id_rutina]);
            res.json({ message: 'Rutina eliminada' });
        });
    }
}
const lineas_rutinaController = new LineasRutinaController();
exports.default = lineas_rutinaController;
