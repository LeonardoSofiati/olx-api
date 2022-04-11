import { Request, Response } from 'express';
import { Op, Sequelize } from "sequelize";
import { State } from '../models/State';
import { User } from '../models/User';
import { Ad } from '../models/Ad';
import { Category } from '../models/Category';
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
    }
}

export const editAction = async (req: Request, res: Response) => {
    res.json({ res: 'editAction' })
}