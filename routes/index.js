import express from "express";
import {registerController, loginController, userController, refreshController, productController} from "../controllers";
import auth from "../middlewares/auth";
const router = express.Router();

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.get('/me',auth,userController.me);
router.post('/refresh',refreshController.refresh);

router.post('/addproduct',auth,productController.store);
router.get('/product/:type',productController.search);
router.post('/product/claim',auth,productController.claim);
router.post('/product/accept',auth,productController.accept);
router.get('/product/calendar/:_id',productController.calendar);
export default router;  