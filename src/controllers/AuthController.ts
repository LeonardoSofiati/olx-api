import {Request, Response} from 'express';
import { generateToken } from '../config/passport';
import { validationResult, matchedData } from 'express-validator';
import * as userService from '../services/userService';

export const signin = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await userService.findByEmail(email);

        if(user && userService.matchPassword(password, user.password)) {
            let data = matchedData(req);

            return res.json({status: true, user, data});
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

        const token = generateToken({email: email});

        const newUser = await userService.createUser(email, password, name, state, token);

        if(newUser instanceof Error) {
            return res.json({error: newUser.message});

        } else if (newUser) {

            let data = matchedData(req);

            res.status(201);
            return res.json({id: newUser.id, token, success: true, data});
        }

    } else {
        return res.json({error: errors.mapped()});
    }
}