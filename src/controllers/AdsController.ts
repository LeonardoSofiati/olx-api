import { Request, Response } from 'express';
import * as adsService from '../services/adsService';
import { validationResult, matchedData } from 'express-validator';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
import { buffer } from 'stream/consumers';

//aqui para salvar local no PC
// const storageConfig = multer.diskStorage({
//     destination: (req: Request, file, cb) => {
//         cb(null, './tmp');
//     },
//     filename: (req: Request, file, cb) => {
//         const filename = uuidv4();
//         cb(null, `${filename}`)
//     }
// })

//salvar na memoria com buffer
const bufferStorage = multer.memoryStorage();

export const upload = multer({
    storage: bufferStorage,
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

        if(allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false)
        }
    }
});

export const getCategories = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        let token: string = req.query.token as string;

        let userValidated = await adsService.findCaterogy(token)

        if(userValidated instanceof Error) {
            return res.json({error: userValidated.message})
        } else if(userValidated) {
            return res.json({category: userValidated} )
        }
    } else {
        return res.json({status: errors.mapped()})
    }
}

export const addAction = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        let token: string = req.body.token;
        let title: string = req.body.title
        let price: number = req.body.price
        let pricenegotiable: boolean = req.body.pricenegotiable
        let description: string = req.body.description
        let category: string = req.body.category
        let image = req.file as  File | undefined;

        //pego a imagem e salvo em buffer na memoria
        let uuidName = uuidv4();

        let imageUrl = `http://localhost:3000/assets/images/${uuidName}.png`

        console.log('imageUrl', imageUrl)

        try {
            if(req.file) {
                await sharp(req.file.buffer).resize(500).toFile(`./public/assets/images/${uuidName}.png`);
            }
        } catch(err) {
            console.log('Error while processing the image',err)
        }

        const createAdd = await adsService.includeAdds(token, title, price, pricenegotiable, description, category,  imageUrl);

        if(createAdd instanceof Error) {
            return res.json({error: createAdd.message})
        } else if(createAdd) {
            return res.json({adDetails: createAdd})
        }
    } else {
        return res.json({status: errors.mapped()})
    }
}


//Realiza filtros mediante informação trazida pelo front e retorna a lista de Anuncios mediante esse filtro
export const getList = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        const token: string = req.headers.authorization as string;
        let sort = req.query.sort as 'ASC' | 'DESC';
        let offset = Number(req.query.offset) as number;
        let limit = Number(req.query.limit) as number;
        let search = req.query.search as string;
        let category = req.query.category as string;
        let state = req.query.state as string;

        try {
            if(sort) {
                const adList = await adsService.adList(sort, offset, limit, search, category, state);

                if(adList instanceof Error) {
                    return res.json({error: adList.message})
                } else if(adList) {
                    return res.json({adList: adList})
                }
            }
        } catch(err) {
            res.json({'Error while processing getList Request': err})
        }

    } else {
        return res.json({status: errors.mapped()})
    }
}

export const getItem = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        let id = Number(req.query.id) as number;
        let other: 'true' | 'false' = req.query.other as 'true' | 'false';
        
        if(other) {
            other.toLocaleLowerCase()
        }

        try {
            let adDetails = await adsService.adItem(id, other);

            if(adDetails instanceof Error) {
                return res.json({error: adDetails.message})
            } else if(adDetails) {
                return res.json({adDetails: adDetails})
            }
        } catch(err) {
            res.json({'Error while processing getItem Request': err})
        }

    } else {
        return res.json({status: errors.mapped()})
    }
}

export const editAction = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        let id = Number(req.query.id) as number;
        let token: string = req.body.token;
        let title: string = req.body.title
        let price: number = req.body.price
        let pricenegotiable: boolean = req.body.pricenegotiable
        let description: string = req.body.description
        let category: string = req.body.category
        let image = req.file as  File | undefined;

        //pego a imagem e salvo em buffer na memoria
        let imageUrl = null;
        
        try {
            if(req.file) {
                let uuidName = uuidv4();

                imageUrl = `http://localhost:3000/assets/images/${uuidName}.png`

                console.log('imageUrl', imageUrl)
                console.log('id', id)
                console.log('token', token)

                await sharp(req.file.buffer).resize(500).toFile(`./public/assets/images/${uuidName}.png`);
            }
        } catch(err) {
            console.log('Error while processing the image',err)
        }

        const changeAd = await adsService.changeAds(id, token, title, price, pricenegotiable, description, category,  imageUrl);

        if(changeAd instanceof Error) {
            return res.json({error: changeAd.message})
        } else if(changeAd) {
            return res.json({adDetails: changeAd})
        }
    } else {
        return res.json({status: errors.mapped()})
    }
}