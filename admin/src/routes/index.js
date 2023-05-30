import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authentication.js';
import { createEmployee, updateEmployee, readEmployee, deleteAcc } from '../controllers/employee_crud/employee.js'
import { createProduct, viewAllProduct, viewOneProduct, updateProduct, deleteProduct } from '../controllers/products/product.js';
import { readOrder } from '../controllers/orders/order.js';

// register for admin
router.post('/register', register);

// login for admin
router.post('/login', login);


// employee  
router.post('/signup/employe', createEmployee);
router.put('/update/employe/:empid', updateEmployee);
router.get('/read/employee', readEmployee);
router.delete('/delete/employe/:empid', deleteAcc);


// product
router.post('/product', createProduct);
router.get('/allProduct', viewAllProduct);
router.get('/product/:id', viewOneProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

// view orders
router.get('/orders', readOrder);


export {router};