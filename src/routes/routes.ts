import { Router } from "express";
import {privateRoute} from '../config/passport';
import * as UserController from '../controllers/UserController';
import * as AuthController from '../controllers/AuthController';
import * as AdsController from '../controllers/AdsController';
import * as AuthValidator from '../validators/AuthValidator'
import * as UserValidator from '../validators/UserValidator';
import * as AdsValidator from '../validators/AdsValidator'

const router = Router();

router.get('/ping', UserController.ping)

router.get('/states', privateRoute, UserController.getStates);

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.get('/user/me', UserValidator.userInfo ,privateRoute, UserController.info);
router.put('/user/me', UserValidator.userEdit, privateRoute, UserController.editAction);

router.get('/categories', AdsValidator.categoryList, privateRoute, AdsController.getCategories);

//validator tem que ser depois do Multer
router.post('/ad/add', privateRoute, AdsController.upload.single('image'), AdsValidator.addAds ,AdsController.addAction);
router.get('/ad/list', privateRoute, AdsValidator.listAds, AdsController.getList);
router.get('/ad/:id', privateRoute, AdsValidator.adItem, AdsController.getItem);
router.post('/ad/:id', privateRoute, AdsController.upload.single('image'), AdsValidator.adChange ,AdsController.editAction);


export default router;