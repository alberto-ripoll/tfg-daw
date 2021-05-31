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
class UserController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            User_1.default.find({}).exec((err, users) => {
                if (err) {
                    console.log('error', err);
                }
                if (users) {
                    res.json({ 'users': users });
                }
            });
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.params.username;
            User_1.default.find({ username: user }, { password: 0, rutinas_recientes: 0, roles: 0, updatedAt: 0, email: 0, _id: 0 }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    res.json(user);
                }
            });
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            User_1.default.find({ _id: id }, { rutinas_creadas: 0, createdAt: 0, friends: 0, rutinas_guardadas: 0, total_Kcal: 0, week_Kcal: 0, password: 0, rutinas_recientes: 0, roles: 0, updatedAt: 0, email: 0 }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    res.json(user);
                }
            });
        });
    }
    searchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.params.username;
            console.log(user);
            User_1.default.find({ username: new RegExp("^" + user) }, { week_kcal: 1, username: 1, _id: 0 }).exec((err, users) => {
                if (err) {
                    console.log('error', err);
                }
                if (users) {
                    res.json(users);
                }
            });
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            User_1.default.findOne({ username: username }, { reviews: { $reverseArray: ['$reviews'] } }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    res.json(user);
                    return;
                }
            });
        });
    }
    sendReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req["userId"];
            const { username } = req.params;
            const review = JSON.parse(req.body.mensaje);
            const mensaje = {
                user_id: userId,
                message: review.message,
                stars: review.stars,
                image: ''
            };
            console.log(username, mensaje);
            //Si no se sube una imagen el JSON estaria vacio y daria error si no se usa try catch
            let imagen = null;
            try {
                imagen = JSON.parse(JSON.stringify(req.file));
            }
            catch (err) {
            }
            if (imagen) {
                mensaje.image = imagen.location;
            }
            User_1.default.findOneAndUpdate({ username: username }, {
                $addToSet: {
                    reviews: {
                        user_id: mensaje.user_id,
                        comment: mensaje.message,
                        date: new Date(),
                        stars: mensaje.stars,
                        image: mensaje.image
                    }
                }
            }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    User_1.default.findOne({ username: username }, { reviews: 1 }).exec((err, user) => {
                        if (err) {
                            console.log('error', err);
                        }
                        if (user) {
                            let media = mensaje.stars;
                            let starsArray = 0;
                            if (user.reviews.length != 0) {
                                user.reviews.forEach(review => {
                                    starsArray += review.stars;
                                });
                                media = Math.round(starsArray / user.reviews.length);
                            }
                            User_1.default.findOneAndUpdate({ username: username }, { $set: { rate: media } }).exec((err, user) => {
                                if (err) {
                                    console.log('error', err);
                                }
                                if (user) {
                                    res.json(true);
                                    return;
                                }
                            });
                        }
                    });
                }
            });
        });
    }
    checkIfSaved(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req["userId"];
            const rutinaId = req.params.id;
            const existe = yield User_1.default.find({ _id: userId, rutinas_guardadas: { $in: [rutinaId] } }).countDocuments();
            if (existe == 1) {
                res.json(true);
            }
            if (existe == 0) {
                res.json(false);
            }
        });
    }
    getSelfInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let myId = req["userId"];
            User_1.default.findOne({ _id: myId }, { password: 0, rutinas_recientes: 0, roles: 0, updatedAt: 0, email: 0 }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    user.pesos = user.pesos.reverse();
                    user.kcals = user.kcals.reverse();
                    res.json(user);
                }
            });
        });
    }
    completarDatosFisicos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let myId = req["userId"];
            const datos = req.body;
            let date = new Date;
            let fecha = (date.getDate()) + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
            User_1.default.findByIdAndUpdate(myId, {
                $set: {
                    pesos: {
                        peso: datos.peso,
                        fecha: fecha
                    },
                    kcals: {
                        kcal: 0,
                        fecha: fecha
                    },
                    sexo: datos.sexo,
                    altura: datos.altura,
                    confirmed: true,
                }
            }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    res.json(user);
                }
            });
        });
    }
    guardarRutinas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req["userId"];
            const rutinaId = req.params.id;
            const existe = yield User_1.default.find({ _id: userId, rutinas_guardadas: { $in: [rutinaId] } }).countDocuments();
            if (existe == 1) {
                User_1.default.findOneAndUpdate({ _id: userId }, {
                    $pull: {
                        rutinas_guardadas: rutinaId
                    }
                }).exec((err, user) => {
                    if (err) {
                        console.log('error', err);
                    }
                    if (user) {
                        res.json(user);
                        return;
                    }
                });
            }
            if (existe == 0) {
                User_1.default.findOneAndUpdate({ _id: userId }, {
                    $addToSet: {
                        rutinas_guardadas: rutinaId
                    }
                }).exec((err, user) => {
                    if (err) {
                        console.log('error', err);
                    }
                    if (user) {
                        res.json(user);
                        return;
                    }
                });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let perfil = JSON.parse(req.body.perfil);
            let id = req["userId"];
            let imagen = null;
            perfil.especialidad = perfil.especialidad.toLowerCase();
            try {
                imagen = JSON.parse(JSON.stringify(req.file));
            }
            catch (err) {
            }
            if (imagen) {
                perfil.profile_pic = imagen.location;
                User_1.default.findByIdAndUpdate(id, {
                    $set: {
                        name: perfil.nombre,
                        ciudad: perfil.ciudad,
                        bio: perfil.bio,
                        profile_pic: perfil.profile_pic,
                        especialidad: perfil.especialidad
                    }
                }).exec((err, user) => {
                    if (err) {
                        console.log('error', err);
                    }
                    if (user) {
                        res.json(user);
                        return;
                    }
                });
            }
            else {
                User_1.default.findByIdAndUpdate(id, {
                    $set: {
                        name: perfil.nombre,
                        ciudad: perfil.ciudad,
                        bio: perfil.bio,
                        isEntrenador: perfil.entrenador,
                        especialidad: perfil.especialidad
                    }
                }).exec((err, user) => {
                    if (err) {
                        console.log('error', err);
                    }
                    if (user) {
                        res.json(user);
                        return;
                    }
                });
            }
        });
    }
    updateKcals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req["userId"];
            let kcals = req.body;
            let nuevosKcals = [];
            let date = new Date;
            for (let index = 0; index < 7; index++) {
                let fecha = ((date.getDate()) - index) + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                yield User_1.default.findByIdAndUpdate(id, {
                    $pull: {
                        kcals: { fecha: fecha }
                    }
                });
            }
            for (let index = 0; index < kcals.length; index++) {
                const objKcal = {
                    kcal: 0
                };
                if (kcals[index]) {
                    objKcal.kcal = kcals[index];
                }
                nuevosKcals.push(objKcal);
            }
            console.log('GUARDO LAS kcals', nuevosKcals);
            let i = 0;
            for (let index = 6; index > -1; index--) {
                let fecha = ((date.getDate()) - index) + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                yield User_1.default.findByIdAndUpdate(id, {
                    $push: {
                        kcals: {
                            kcal: nuevosKcals[i]["kcal"],
                            fecha: fecha,
                        }
                    }
                });
                i++;
            }
        });
    }
    updatePesos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req["userId"];
            let pesos = req.body;
            let nuevosPesos = [];
            let date = new Date;
            for (let index = 0; index < 7; index++) {
                let fecha = ((date.getDate()) - index) + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                yield User_1.default.findByIdAndUpdate(id, {
                    $pull: {
                        pesos: { fecha: fecha }
                    }
                });
            }
            for (let index = 0; index < pesos.length; index++) {
                const objPeso = {
                    peso: 0
                };
                if (pesos[index]) {
                    objPeso.peso = pesos[index];
                }
                nuevosPesos.push(objPeso);
            }
            let i = 0;
            for (let index = 6; index > -1; index--) {
                let fecha = ((date.getDate()) - index) + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                yield User_1.default.findByIdAndUpdate(id, {
                    $push: {
                        pesos: {
                            peso: nuevosPesos[i]["peso"],
                            fecha: fecha,
                        }
                    }
                });
                i++;
            }
        });
    }
    getPesos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req["userId"];
            let intervalo = parseInt(req.params.intervalo);
            User_1.default.findById(id, { pesos: { "$slice": -intervalo } }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    let pesos = user.pesos;
                    res.json({ pesos: pesos });
                }
            });
        });
    }
    getKcals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req["userId"];
            let intervalo = parseInt(req.params.intervalo);
            User_1.default.findById(id, { kcals: { "$slice": -intervalo } }).exec((err, user) => {
                if (err) {
                    console.log('error', err);
                }
                if (user) {
                    let kcals = user.kcals;
                    res.json({ kcals: kcals });
                }
            });
        });
    }
}
const userController = new UserController();
exports.default = userController;
