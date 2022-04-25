import {Request, Response, NextFunction} from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import {User} from '../models/User';
import jwt from 'jsonwebtoken';

dotenv.config();

const notAuthorizedJson = {status: 401, message: 'Não autorizado'};

const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
};

passport.use(new JWTStrategy(option, async (payload, done) => {
    const user = await User.findByPk(payload.id);

    if(user) {
        return done(null, user);
    } else {
        return done(notAuthorizedJson, false);

    }
}))

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    const authFunction = passport.authenticate('jwt', (err, user) => {
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    });
    authFunction(req, res, next)
}

export const generateToken = (data: object) => {
    return jwt.sign(data, process.env.JWT_SECRET as string)
}

export default passport;