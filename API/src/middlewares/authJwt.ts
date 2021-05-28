import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import secret from '../secret'
import User from '../models/User'

export const verifyToken = async (req: Request, res: Response, next: any) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(403).json({ message: "No token provided!" })

        const decoded = jwt.verify(token, secret.SECRET)
        const user = await User.findById(decoded["id"])
        req["userId"] = decoded["id"]

        if (!user) return res.status(404).json({ message: 'No user found' });
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
