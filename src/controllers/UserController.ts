import { Request, Response } from 'express';
import { State } from '../models/State';
import * as userService from '../services/userService';
import { validationResult, matchedData } from 'express-validator';

export const ping = async (req: Request, res: Response) => {
    res.json({ res: 'ponggggg' })
}

export const getStates = async (req: Request, res: Response) => {
    let states = await State.findAll({})
    return res.json(states)
}

export const info = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let token: string = req.query.token as string;

        const userDetails = await userService.findUserDetails(token);
        
        if (userDetails instanceof Error) {
            return res.json({error: userDetails.message})
        } else if(userDetails) {
            return res.json({user: userDetails})
        }
    } else {
        return res.json({status: errors.mapped()})
    }
}

export const editAction = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        let {token, email, password, name, state} = req.body;

        const editedDetails = await userService.editUserDetails(token, email, password, name, state);

        if(editedDetails instanceof Error) {
            return res.json({error: editedDetails.message})
        } else if(editedDetails) {
            return res.json({edited: editedDetails, status: 'sucesso'})
        }

        const data = matchedData(req)
        res.json({ res: 'editAction' })
    } else  {
        return res.json({status: errors.mapped()})
    }
}