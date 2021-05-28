import express, { Application } from "express";
import morgan from 'morgan';
import cors from 'cors';

// MONGO
import './mongodatabase'

/*RUTAS*/
import lineasRutinaRoutes from './routes/lineasRutinaRoutes';
import rutinaRoutes from './routes/rutinaRoutes'
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes'
import friendsRoutes from './routes/friendsRoutes'
import chatsRoutes from './routes/chatsRoutes'
import entrenadoresRoutes from './routes/entrenadoresRoutes'
import salasRoutes from './routes/salasRoutes'

import { Server, Socket } from "socket.io";

class Servidor {
    public app: Application
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        require('dotenv').config();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express.static('public'));
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }))

    }

    routes(): void {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/rutinas', rutinaRoutes);
        this.app.use('/api/lineasrutina', lineasRutinaRoutes);
        this.app.use('/api/users', userRoutes);
        this.app.use('/api/entrenadores', entrenadoresRoutes);
        this.app.use('/api/friends', friendsRoutes);
        this.app.use('/api/chat', chatsRoutes);
        this.app.use('/api/salas', salasRoutes);
        this.app.use('/', express.static(__dirname + '/public'));
        this.app.use('/:anything', express.static(__dirname + '/public'));

    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server running on port', this.app.get('port'))
        })
    }
}

const servidor = new Servidor();

servidor.start();