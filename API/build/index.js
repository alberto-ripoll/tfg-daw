"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// MONGO
require("./mongodatabase");
/*RUTAS*/
const lineasRutinaRoutes_1 = __importDefault(require("./routes/lineasRutinaRoutes"));
const rutinaRoutes_1 = __importDefault(require("./routes/rutinaRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const friendsRoutes_1 = __importDefault(require("./routes/friendsRoutes"));
const chatsRoutes_1 = __importDefault(require("./routes/chatsRoutes"));
const entrenadoresRoutes_1 = __importDefault(require("./routes/entrenadoresRoutes"));
const salasRoutes_1 = __importDefault(require("./routes/salasRoutes"));
class Servidor {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        require('dotenv').config();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.static('public'));
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api/auth', authRoutes_1.default);
        this.app.use('/api/rutinas', rutinaRoutes_1.default);
        this.app.use('/api/lineasrutina', lineasRutinaRoutes_1.default);
        this.app.use('/api/users', userRoutes_1.default);
        this.app.use('/api/entrenadores', entrenadoresRoutes_1.default);
        this.app.use('/api/friends', friendsRoutes_1.default);
        this.app.use('/api/chat', chatsRoutes_1.default);
        this.app.use('/api/salas', salasRoutes_1.default);
        this.app.use('/', express_1.default.static(__dirname + '/public'));
        this.app.use(express_1.default.static(__dirname + '/public'));
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server running on port', this.app.get('port'));
        });
    }
}
const servidor = new Servidor();
servidor.start();
