import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authentication.js';
import { createEmployee, updateEmployee, readEmployee, deleteAcc } from '../controllers/employee_crud/employee.js'
import { createProduct, viewAllProduct, viewOneProduct, updateProduct, deleteProduct } from '../controllers/products/product.js';
import { readOrder } from '../controllers/orders/order.js';
import { admin_wallet } from '../controllers/wallet.js';
import { jwtValidator } from '../middleware/authentication.js';

// register for admin
router.post('/register', register);

// login for admin
router.post('/login', login);


// employee  
router.post('/signup/employe', jwtValidator, createEmployee);
router.put('/update/employe/:empid', jwtValidator, updateEmployee);
router.get('/read/employee', jwtValidator, readEmployee);
router.delete('/delete/employe/:empid', jwtValidator, deleteAcc);


// product
router.post('/product', jwtValidator, createProduct);
router.get('/allProduct', jwtValidator, viewAllProduct);
router.get('/product/:id', jwtValidator, viewOneProduct);
router.put('/product/:id', jwtValidator, updateProduct);
router.delete('/product/:id', jwtValidator, deleteProduct);

// view orders
router.get('/orders', jwtValidator, readOrder);

// view wallet
router.get('/wallet', jwtValidator, admin_wallet);



export {router};