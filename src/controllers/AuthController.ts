import {Request, Response} from 'express';
import { User } from '../models/User';
import { generateToken } from '../config/passport';
import { validationResult, matchedData } from 'express-validator';

export const signin = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({
            where: {email, password}
        });

        let data = matchedData(req);

        if(user) {
            const token = generateToken({id: user.id})
            return res.json({status: true, token, data});
        } else {
            return res.json({status: 'E-mail ou senha invalidos'})
        }
    } else {
        return res.json({status: errors.mapped()})
    }
}

export const signup = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        let {email, password, name, state} = req.body;

        let hasUser = await User.findOne({ where: { email}});

        if(!hasUser) {
            let newUser = await User.create({email, password, name, state});
            const token = generateToken({id: newUser.id});

            let data = matchedData(req);

            res.status(201);
            return res.json({id: newUser.id, token, success: true, data});
        } else {
            return res.json({error: 'E-mail já existente'});
        }
    } else {
        return res.json({error: errors.mapped()});
    }
}