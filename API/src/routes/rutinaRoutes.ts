import { Router } from 'express';
import rutinasController from '../controllers/rutinasController'
import _multers3 from '../services/multers3'
import {authJwt} from '../middlewares/index';


class RutinasRoutes {
    public router: Router = Router();
    
    constructor(){
        this.config();
    }

    config(): void{
            this.router.get('/', rutinasController.get)
            this.router.get('/creadas/:username',[authJwt.verifyToken], rutinasController.getCreadas)
            // this.router.get('/guardadas',[authJwt.verifyToken], rutinasController.getGuardadas)
            this.router.get('/filtrar/:filtro',[authJwt.verifyToken], rutinasController.getFiltradas)
            this.router.get('/filtrarusuario/:filtro',[authJwt.verifyToken], rutinasController.getFiltradasUsu)

            this.router.get('/search/:searchString', rutinasController.search)
            this.router.get('/:id', rutinasController.getOne)
            this.router.post('/',[authJwt.verifyToken,_multers3.single('image')], rutinasController.create)
            this.router.put('/:id',[authJwt.verifyToken], rutinasController.update)
            this.router.delete('/:id',[authJwt.verifyToken], rutinasController.delete)

    }
}

const rutinasRoutes = new RutinasRoutes();
export default rutinasRoutes.router; 