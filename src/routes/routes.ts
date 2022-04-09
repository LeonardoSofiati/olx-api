import { Router } from "express";
import {privateRoute} from '../config/passport';
import * as UserController from '../controllers/UserController';
import * as AuthController from '../controllers/AuthController';
import * as AdsController from '../controllers/AdsController';
import * as AuthValidator from '../validators/AuthValidator'

const router = Router();

router.get('/ping', UserController.ping)

router.get('/states', privateRoute, UserController.getStates);

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.post('/user/me', privateRoute, UserController.info);
router.post('/user/me', privateRoute, UserController.editAction);

router.get('/categories', AdsController.getCategories);

router.post('ad/add', privateRoute, AdsController.addAction);
router.get('ad/list', AdsController.getList);
router.get('ad/item', AdsController.getItem);
router.post('ad/:id', privateRoute, AdsController.editAction);


export default router;