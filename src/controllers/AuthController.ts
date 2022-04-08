import {Request, Response} from 'express';
import { User } from '../models/User';
import { generateToken } from '../config/passport';

export const signin = async (req: Request, res: Response) => { //arrumar um jeito de colocar o validators aqui ai invés desse if() porco abaixo, então primeiro valido com o express-validator e só se não tiver erro (no lugar desse if) começo a fazer a verificação com o passport do generateToken().
    //olhar também: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/ E https://stackoverflow.com/questions/27056195/nodejs-express-validator-with-passport
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({
            where: {email, password}
        });

        if(user) {
            const token = generateToken({id: user.id})
            return res.json({status: true, token});
        }
    }
    return res.json({status:false})
}

export const signup = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let {email, password} = req.body;

        let hasUser = await User.findOne({ where: { email}});

        if(!hasUser) {
            let newUser = await User.create({email, password});
            const token = generateToken({id: newUser.id});

            res.status(201);
            return res.json({id: newUser.id, token});
        } else {
            return res.json({error: 'E-mail já existente'});
        }
    }
    return res.json({error: 'E-mail e/ou senha não enviados'});
}