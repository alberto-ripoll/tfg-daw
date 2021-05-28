import { Router } from 'express';
import {authJwt,verifySignUp} from '../middlewares/index';

import friendsController from '../controllers/friendsController'
class FriendsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',[authJwt.verifyToken], friendsController.getFriends)
        this.router.put('/',[authJwt.verifyToken], friendsController.addFriend)

        // this.router.get('/user/:id',[authJwt.verifyToken], userController.getUser)
        // this.router.post('/', [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkRoles], userController.createUser)
        // this.router.delete('/user/:id', userController.deleteUser)

    }
}

const friendsRoutes = new FriendsRoutes();
export default friendsRoutes.router;