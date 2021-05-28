import { Router } from 'express';
import {authJwt,verifySignUp} from '../middlewares/index';

import ChatController from '../controllers/chatController'
class ChatRoutes {
    public router: Router = Router();
    
    constructor(){
        this.config();
    }

    config(): void{
            this.router.get('/:friend',[authJwt.verifyToken],ChatController.getMessages)
            this.router.post('/:friend',[authJwt.verifyToken],ChatController.sendMessage)

    }
}

const chatRoutes = new ChatRoutes();
export default chatRoutes.router; 