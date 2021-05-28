import { Request, Response} from 'express';
import User from '../models/User';

class ChatController {
    async getMessages(req: Request,res: Response){
        let userId= req["userId"]
        let friend = req.params.friend;
        User.findById(userId,{messages: 1,_id:0}).exec((err,messages)=> {
            if (err){
                console.log('error',err)
            }
            if (messages){
                let mensajesIntercambios = [];
                messages.messages.forEach(message => {
                    if (message.from==friend || message.to==friend){
                        mensajesIntercambios.push(message);
                    }
                })
                res.json(mensajesIntercambios)
            }
        });
    } 

    async sendMessage(req: Request,res: Response){
        let userId= req["userId"]
        let message = req.body.message;

        User.findById(userId,{username:1}).exec((err,user)=>{
            if (err){

            }
            if (user){
                message.from = user.username;
                User.findByIdAndUpdate(userId,
                    {$addToSet:{
                        messages: message
                    }
                    }).exec((err,user)=> {
                    if (err){
                        console.log('error',err)
                    }
                    if (user){
                        User.findOneAndUpdate({username:message.to},
                            {$addToSet:{
                                messages: message,
                                friends:message.from
                            }
                            }).exec((err,user)=> {
                            if (err){
                                console.log('error',err)
                            }
                            if (user){
                                res.json(true)
                            }
                        });
                    }
                });
            }
        })

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

const chatController = new ChatController();
export default chatController;