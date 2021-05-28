import { Request, Response} from 'express';
import User from '../models/User';

class FriendsController {
    async getFriends(req: Request,res: Response){
        let userId= req["userId"]

        User.find({_id:userId},{friends:1,_id:0}).exec((err,friends)=> {
            if (err){
                console.log('error',err)
            }
            if (friends){
                res.json(friends)
            }
        });
    } 
    async addFriend(req: Request,res: Response){
        let userId= req["userId"]


        User.findByIdAndUpdate(userId,{
            $addToSet:{
                friends:req.body.username
            }
        }).exec((err,friends)=> {
            if (err){
                console.log('error',err)
            }
            if (friends){
                res.json(friends)
            }
        });
    } 
}

const friendsController = new FriendsController();
export default friendsController;