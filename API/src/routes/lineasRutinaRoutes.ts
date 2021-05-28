import { Router } from 'express';
import LineasRutinaController from '../controllers/lineasRutinaController'
import _multers3 from '../services/multers3'

class LineasRutinaRoutes {
    public router: Router = Router();
    
    constructor(){
        this.config();
    }

    config(): void{
            this.router.get('/:id_rutina', LineasRutinaController.get)
            this.router.get('/:id_rutina/:id_linea', LineasRutinaController.getOne)
            this.router.post('/:id_rutina',_multers3.single('image'), LineasRutinaController.create)
            this.router.put('/:id_rutina/:id_linea', LineasRutinaController.update)
            this.router.delete('/:id_rutina', LineasRutinaController.deleteAll)
            this.router.delete('/:id_rutina/:id_linea', LineasRutinaController.deleteOne)
    }
}

const lineasRutinaRoutes = new LineasRutinaRoutes();
export default lineasRutinaRoutes.router; 