import { Router } from 'express';
import {authJwt,verifySignUp} from '../middlewares/index';

import userController from '../controllers/userController'
import _multers3 from '../services/multers3';
class UsersRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',[authJwt.verifyToken], userController.getUsers)

        this.router.get('/myself',[authJwt.verifyToken], userController.getSelfInfo)
        this.router.put('/myself',[authJwt.verifyToken], userController.completarDatosFisicos)

        this.router.put('/user/:username',[authJwt.verifyToken,_multers3.single('image')], userController.updateProfile)
        this.router.post('/user/:username/reviews', [authJwt.verifyToken,_multers3.single('image')], userController.sendReview)
        this.router.get('/user/:username/reviews', [authJwt.verifyToken], userController.getReviews)
        this.router.get('/user/:username',[authJwt.verifyToken], userController.getUser)
        this.router.get('/user/id/:id',[authJwt.verifyToken], userController.getUserById)
        this.router.get('/user/guardarRutina/:id',[authJwt.verifyToken], userController.guardarRutinas)
        this.router.get('/user/checkIfSaved/:id',[authJwt.verifyToken], userController.checkIfSaved)

        this.router.put('/pesos', [authJwt.verifyToken], userController.updatePesos)
        this.router.get('/pesos/:intervalo', [authJwt.verifyToken], userController.getPesos)

        this.router.put('/kcals', [authJwt.verifyToken], userController.updateKcals)
        this.router.get('/kcals/:intervalo', [authJwt.verifyToken], userController.getKcals)

        this.router.get('/search/:username', userController.searchUser)

    }
}

const usersRoutes = new UsersRoutes();
export default usersRoutes.router;