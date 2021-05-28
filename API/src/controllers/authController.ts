import User from '../models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import secret from '../secret'
import Role from '../models/Role';

export const signUp = async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (name =='' || username =='' || email =='' || password ==''){
        return res.status(400).json({message:"Campos vacios"})
    }
    const newUser = new User({
        name,
        username,
        email,
        password: await User.encryptPassword(password),
        pesos:[{fecha: User.setDate() ,peso:0}],
        kcals:[{fecha: User.setDate() ,kcal:0}]

    })

    const savedUser = await newUser.save();
    console.log(savedUser);
    const token = jwt.sign({id:savedUser._id}, secret.SECRET, {
        expiresIn: 86400
    })

    res.json({token})
}


export const signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userFound = await User.findOne({username: req.body.username})

    if (!userFound) return res.json({message:"user-not-found"})
    const pass_match = await User.comparePassword(password, userFound.password);
    if (!pass_match) {
        return res.json({message:'invalid-password'})
    }

    const token = jwt.sign({id:userFound._id}, secret.SECRET, {
        expiresIn: 86400
    })

    res.json({token})
}