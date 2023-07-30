import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authentication.js';
import { createEmployee, payEmployee, getEmployee, getSingleEmployee, deleteAcc } from '../controllers/employee.js'
import { createProduct, viewAllProduct, viewOneProduct, updateProduct, deleteProduct } from '../controllers/product.js';
import { readOrder } from '../controllers/order.js';
import { admin_wallet } from '../controllers/wallet.js';
import { forgetPassword, passwordReset} from '../controllers/passwordReset.js';
import { jwtValidator } from '../middleware/authentication.js';

// register for admin
router.post('/register', register);

// login for admin
router.post('/login', login);


// employee  
router.post('/employee', jwtValidator, createEmployee);
router.patch('/pay/:empid', jwtValidator, payEmployee);
router.get('/employee', jwtValidator, getEmployee);
router.get('/employee/:id', jwtValidator, getSingleEmployee)
router.delete('/employee/:id', jwtValidator, deleteAcc);


// product
router.post('/product', jwtValidator, createProduct);
router.get('/product', jwtValidator, viewAllProduct);
router.get('/product/:id', jwtValidator, viewOneProduct);
router.put('/product/:id', jwtValidator, updateProduct);
router.delete('/product/:id', jwtValidator, deleteProduct);

// view orders
router.get('/orders', jwtValidator, readOrder);

// view wallet
router.get('/wallet', jwtValidator, admin_wallet);

// reset password
router.post('/forget-password', forgetPassword);
router.post('/reset-password', passwordReset);


export {router};