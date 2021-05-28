import { Router } from 'express';
import {authJwt,verifySignUp} from '../middlewares/index';

import EntrenadoresController from '../controllers/entrenadoresController'

class EntrenadoresRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',[authJwt.verifyToken], EntrenadoresController.getEntrenadores)
        this.router.get('/filtrar/:filtro',[authJwt.verifyToken], EntrenadoresController.getFiltrados)
        // this.router.get('/user/:id',[authJwt.verifyToken], userController.getUser)
        // this.router.post('/', [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkRoles], userController.createUser)
        // this.router.delete('/user/:id', userController.deleteUser)

    }
}

const entrenadoresRoutes = new EntrenadoresRoutes();
export default entrenadoresRoutes.router;