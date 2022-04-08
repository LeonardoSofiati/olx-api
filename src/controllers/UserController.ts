import {Request, Response} from 'express';
import {Op, Sequelize} from "sequelize";
import { State } from '../models/State';

export const ping = async (req: Request, res: Response) => {
    res.json({res: 'ponggggg'})
}

export const getStates = async (req: Request, res: Response) => {
        let states = await State.findAll({})
        return res.json(states) 
}

export const info = async (req: Request, res: Response) => {
    res.json({res: 'info'})
}

export const editAction = async (req: Request, res: Response) => {
    res.json({res: 'editAction'})
}