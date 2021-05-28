import { Router } from 'express';

import * as authController from '../controllers/authController.js'
import { verifySignUp } from '../middlewares/index.js';
class AuthRoutes {
    public router: Router = Router();
    
    constructor(){
        this.config();
    }

    config(): void{
            this.router.post('/signup',verifySignUp.checkDuplicated,authController.signUp)
            this.router.post('/signin',authController.signIn)

    }
}

const authRoutes = new AuthRoutes();
export default authRoutes.router; 