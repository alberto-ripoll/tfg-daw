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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const validator_1 = __importDefault(require("validator"));
const nanoid_1 = require("nanoid");
const User_1 = __importDefault(require("../models/User"));
class RutinasController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rutinas = yield database_1.default.query('SELECT * FROM rutinas ORDER BY created_at DESC;');
            res.json({ rutinas });
        });
    }
    getCreadas(req, res) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            const queryCreadas = yield User_1.default.find({ username: username }, { rutinas_creadas: 1, _id: 0 });
            let rutinas_creadas = queryCreadas[0].rutinas_creadas;
            let rutinasEncontradas = [];
            try {
                for (var rutinas_creadas_1 = __asyncValues(rutinas_creadas), rutinas_creadas_1_1; rutinas_creadas_1_1 = yield rutinas_creadas_1.next(), !rutinas_creadas_1_1.done;) {
                    const rutina = rutinas_creadas_1_1.value;
                    let rutinas_creada = Object.values(JSON.parse(JSON.stringify(yield database_1.default.query(`SELECT * FROM rutinas WHERE id='${rutina}';`))));
                    rutinasEncontradas.push(rutinas_creada[0]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rutinas_creadas_1_1 && !rutinas_creadas_1_1.done && (_a = rutinas_creadas_1.return)) yield _a.call(rutinas_creadas_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log('BUSQUEDA FINALIZADA', rutinasEncontradas);
            res.json(rutinasEncontradas);
        });
    }
    getFiltradasUsu(req, res) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req["userId"];
            let array_filtros = req.params.filtro.split('&');
            let filtro_parte_rutinas = array_filtros[0].split('=');
            let filtro_rutina = filtro_parte_rutinas[1];
            let CondiciontipoQuery = '';
            //Si los filtros solo contienen condicion de ordenar
            if (array_filtros.length == 2 && array_filtros[1].includes('stars')) {
                let stars = array_filtros[1].slice(-1);
                if (stars == '1') {
                    CondiciontipoQuery = `ORDER BY stars DESC`;
                }
                if (stars == '0') {
                    CondiciontipoQuery = `ORDER BY created_at DESC`;
                }
            }
            //Si los filtros solo contienen condicion de tipo
            if (array_filtros.length >= 2 && array_filtros[1].indexOf('stars') == -1) {
                for (let i = 1; i < array_filtros.length; i++) {
                    CondiciontipoQuery += `tipo='${array_filtros[i]}' ||`;
                }
                CondiciontipoQuery = CondiciontipoQuery.slice(0, -3);
                CondiciontipoQuery = '&& (' + CondiciontipoQuery + ')';
            }
            //Si los filtros contienen condicion de ambos tipos
            if (array_filtros.length > 2 && array_filtros[1].indexOf('stars') != -1) {
                let stars = array_filtros[1].slice(-1);
                CondiciontipoQuery = '&& (';
                for (let i = 2; i < array_filtros.length; i++) {
                    CondiciontipoQuery += `(tipo='${array_filtros[i]}') || `;
                }
                CondiciontipoQuery = CondiciontipoQuery.slice(0, -3);
                if (stars == '1') {
                    CondiciontipoQuery += `) ORDER BY stars DESC`;
                }
                if (stars == '0') {
                    CondiciontipoQuery += `) ORDER BY created_at DESC`;
                }
            }
            let rutinasEncontradas = [];
            switch (filtro_rutina) {
                case 'guardadas':
                    const queryGuardadas = yield User_1.default.findById(userId, { rutinas_guardadas: 1, _id: 0 });
                    let rutinas_guardadas = queryGuardadas.rutinas_guardadas;
                    try {
                        for (var rutinas_guardadas_1 = __asyncValues(rutinas_guardadas), rutinas_guardadas_1_1; rutinas_guardadas_1_1 = yield rutinas_guardadas_1.next(), !rutinas_guardadas_1_1.done;) {
                            const rutina = rutinas_guardadas_1_1.value;
                            let query = `SELECT * FROM rutinas WHERE id='${rutina}' ${CondiciontipoQuery};`;
                            let rutina_guardada = Object.values(JSON.parse(JSON.stringify(yield database_1.default.query(query))));
                            rutinasEncontradas.push(rutina_guardada[0]);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (rutinas_guardadas_1_1 && !rutinas_guardadas_1_1.done && (_a = rutinas_guardadas_1.return)) yield _a.call(rutinas_guardadas_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    break;
                case 'creadas':
                    let query = `SELECT * FROM rutinas WHERE user_id='${userId}' ${CondiciontipoQuery};`;
                    console.log(query);
                    let rutinas_creadas = Object.values(JSON.parse(JSON.stringify(yield database_1.default.query(query))));
                    rutinasEncontradas = rutinas_creadas;
                    break;
            }
            return res.json(rutinasEncontradas);
        });
    }
    getFiltradas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtro = req.params.filtro.split('&');
            let stars = filtro[0].slice(-1);
            let condition_stars = '';
            if (stars == '0') {
                condition_stars = 'ORDER BY created_at DESC';
            }
            if (stars == '1') {
                condition_stars = 'ORDER BY stars DESC';
            }
            let tipoQuery = '';
            if (filtro.length > 1) {
                tipoQuery = 'WHERE ';
                for (let i = 1; i < filtro.length; i++) {
                    tipoQuery += `tipo='${filtro[i]}' ||`;
                }
                tipoQuery = tipoQuery.slice(0, -3);
            }
            let query = `SELECT * FROM rutinas ${tipoQuery} ${condition_stars};`;
            console.log(query);
            const rutinas = yield database_1.default.query(query);
            res.json(rutinas);
        });
    }
    getGuardadas(req, res) {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield User_1.default.findById(req["userId"], { rutinas_guardadas: 1, _id: 0 });
            let rutinas = [];
            let rutinas_guardadas = query.rutinas_guardadas;
            console.log(rutinas_guardadas);
            try {
                for (var rutinas_guardadas_2 = __asyncValues(rutinas_guardadas), rutinas_guardadas_2_1; rutinas_guardadas_2_1 = yield rutinas_guardadas_2.next(), !rutinas_guardadas_2_1.done;) {
                    const rutina = rutinas_guardadas_2_1.value;
                    let rutina_guardada = Object.values(JSON.parse(JSON.stringify(yield database_1.default.query('SELECT * FROM rutinas WHERE id=?;', rutina))));
                    rutinas.push(rutina_guardada[0]);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (rutinas_guardadas_2_1 && !rutinas_guardadas_2_1.done && (_a = rutinas_guardadas_2.return)) yield _a.call(rutinas_guardadas_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            res.json({ rutinas });
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rutina = yield database_1.default.query("SELECT * FROM rutinas WHERE id = ?", [id]);
            if (rutina.length > 0) {
                return res.json(rutina[0]);
            }
            res.status(404).json({ message: 'La rutina no existe' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let rutina_data = JSON.parse(req.body.rutina);
            let validate_title = !validator_1.default.isEmpty(rutina_data.title);
            if (!validate_title) {
                res.json({ status: 'failed', message: 'La rutina debe tener un nombre' });
                return;
            }
            let id_rutina = nanoid_1.nanoid();
            let rutina = {
                id: id_rutina,
                title: rutina_data.title,
                description: rutina_data.description,
                image: 'https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg',
                user_id: req["userId"],
                tipo: rutina_data.tipo
            };
            //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
            let imagen = null;
            try {
                imagen = JSON.parse(JSON.stringify(req.file));
            }
            catch (err) {
            }
            if (imagen) {
                rutina.image = imagen.location;
            }
            yield database_1.default.query('INSERT INTO rutinas SET ?', [rutina]);
            yield User_1.default.findByIdAndUpdate(req["userId"], { $push: { "rutinas_creadas": id_rutina }, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    if (result) {
                        console.log("RESULT: " + result);
                    }
                } });
            return res.status(200).json({ status: 'success', rutina: rutina });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield database_1.default.query('UPDATE rutinas set stars = stars+1 WHERE id = ?', [id]);
                res.json({ message: 'Rutina actualizada' });
            }
            catch (err) {
                console.log("NO Funciono");
                res.status(404).json({ message: 'Error' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const userId = req["userId"];
            yield database_1.default.query('DELETE FROM lineas_rutina WHERE id_rutina = ?', [id]);
            yield database_1.default.query('DELETE FROM rutinas WHERE id = ?', [id]);
            User_1.default.findOneAndUpdate({ _id: userId }, {
                $pull: {
                    rutinas_creadas: id,
                    rutinas_guardadas: id
                }
            }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    res.json({ message: 'Rutina eliminada' });
                    return;
                }
            });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchString } = req.params;
            const rutinas = yield database_1.default.query("SELECT * FROM rutinas WHERE title LIKE ?", ['%' + searchString + '%']);
            if (rutinas.length > 0) {
                return res.json(rutinas);
            }
            res.status(404).json({ message: 'No se ha encontrado nada' });
        });
    }
    getImage(req, res) {
    }
}
const rutinasController = new RutinasController();
exports.default = rutinasController;
