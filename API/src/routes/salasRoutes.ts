import { Router } from 'express';
import salasController from '../controllers/salasController'
import _multers3 from '../services/multers3'
import {authJwt} from '../middlewares/index';


class SalasRoutes {
    public router: Router = Router();
    
    constructor(){
        this.config();
    }

    config(): void{
            this.router.get('/',[authJwt.verifyToken], salasController.get)
            this.router.post('/',[authJwt.verifyToken,_multers3.single('image')], salasController.create)
            this.router.get('/filtrar/:filtro',[authJwt.verifyToken], salasController.getFiltradas)


    }
}

const salasRoutes = new SalasRoutes();
export default salasRoutes.router; 