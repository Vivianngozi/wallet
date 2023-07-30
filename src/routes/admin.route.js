import express from 'express';
const router = express.Router();
import { register, login, createEmployees, deleteOneEmployee, forgetPassword, getAllEmployees, getBalance, getOneEmployee, passwordReset, payOneEmployee, readOrder } from '../controllers/admin.controller.js';
// import { createProduct, viewAllProduct, viewOneProduct, updateProduct, deleteProduct } from '../controllers/product.js';
import { jwtValidator } from '../middleware/authentication.js';
import { adminAuthValidator} from '../middleware/validator.js'

// register for admin
router.post('/register', adminAuthValidator, register);
router.post('/login',adminAuthValidator, login);


// employee  
router.post('/employee', jwtValidator, createEmployees);
router.patch('/employee/pay/:id', jwtValidator, payOneEmployee);
router.get('/employee', jwtValidator, getAllEmployees);
router.get('/employee/:id', jwtValidator, getOneEmployee)
router.delete('/employee/:id', jwtValidator, deleteOneEmployee);


// product
// router.post('/product', jwtValidator, createProduct);
// router.get('/product', jwtValidator, viewAllProduct);
// router.get('/product/:id', jwtValidator, viewOneProduct);
// router.put('/product/:id', jwtValidator, updateProduct);
// router.delete('/product/:id', jwtValidator, deleteProduct);

// view orders
router.get('/orders', jwtValidator, readOrder);

// view wallet
router.get('/wallet', jwtValidator, getBalance);

// reset password
router.post('/forget-password', forgetPassword);
router.post('/reset-password', passwordReset);


export default router;