import express, {Request, Response, ErrorRequestHandler} from 'express';
import path from 'path';
import router from '../src/routes/routes'
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { MulterError } from 'multer';

dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.use(passport.initialize());


server.use(router);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({error: 'Endpoint não encontrado.'})
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status)
    } else {
        res.status(400) //BAD REQUEST
    }
    if(err.message) {
        res.json({error: err.message});
    } else {
        res.json({error: 'Ocorreu algum erro, contate o suporte'})
    }
    if(err instanceof MulterError) {
        res.json({
            error: err.code,
            message: err.message
        })
    }
}

server.use(errorHandler);

server.listen(process.env.PORT)