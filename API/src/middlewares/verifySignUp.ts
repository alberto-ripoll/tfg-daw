import { Request, Response } from 'express';
import User from '../models/User';

export const checkDuplicated = async (req: Request, res: Response, next: any) => {
    const user = await User.findOne({username: req.body.username })
    if (user) return res.json({message:'El usuario ya existe'});

    const email = await User.findOne({ email: req.body.email })
    if (email) return res.json({message:'El email ya esta en uso'});
    next()
}