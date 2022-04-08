import {Request, Response} from 'express';
import { Ad } from '../models/Ad';

export const getCategories = async (req: Request, res: Response) => {
    res.json({res: 'getCategories'})
}

export const addAction = async (req: Request, res: Response) => {
    res.json({res: 'addAction'})
}

export const getList = async (req: Request, res: Response) => {
    res.json({res: 'getList'})
}

export const getItem = async (req: Request, res: Response) => {
    res.json({res: 'getItem'})
}

export const editAction = async (req: Request, res: Response) => {
    res.json({res: 'editAction'})
}