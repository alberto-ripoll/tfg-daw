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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    especialidad: { type: String },
    messages: [{
            date: { type: Date, default: Date.now },
            from: { type: String },
            to: { type: String },
            text: { type: String }
        }],
    confirmed: {
        type: Boolean,
        default: false
    },
    ciudad: {
        type: String,
    },
    sexo: {
        type: String,
    },
    altura: {
        type: Number,
    },
    bio: {
        type: String
    },
    pesos: [{
            fecha: { type: String },
            peso: { type: Number }
        }],
    kcals: [{
            fecha: { type: String },
            kcal: { type: Number }
        }],
    rate: {
        type: Number,
        default: 1
    },
    reviews: [{
            date: { type: Date, default: Date.now },
            user_id: { type: String },
            comment: { type: String },
            stars: { type: Number },
            image: { type: String }
        }],
    fullName: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Offline"
    },
    profile_pic: {
        type: String,
        default: "https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg"
    },
    total_Kcal: {
        type: Number,
        default: 0
    },
    week_Kcal: {
        type: Number,
        default: 0
    },
    rutinas_creadas: [],
    rutinas_guardadas: [],
    rutinas_recientes: [],
    isEntrenador: {
        type: Boolean,
        default: false
    },
    friends: [],
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.statics.encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
});
userSchema.statics.setDate = () => {
    let date = new Date;
    date.toString();
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
};
userSchema.statics.comparePassword = (password, receivedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.compare(password, receivedPassword);
});
userSchema.statics.build = (attr) => {
    return new User(attr);
};
const User = mongoose_1.default.model('User', userSchema);
const build = (attr) => {
    return new User(attr);
};
exports.default = User;
