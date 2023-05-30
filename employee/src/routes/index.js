import express from 'express';
const empRouter = express.Router();
import { login, readOne } from "../controllers/employee_side.js";
import { viewAllProduct, viewOneProduct } from "../controllers/product.js";
import { placeOrder, readOrder } from "../controllers/order.js";

// login employee
empRouter.post('/login/employee', login);

// get details
empRouter.get('/employeeDetail/:id', readOne);

// view all products
empRouter.get('/product', viewAllProduct);

// view one product
empRouter.get('/product/:id', viewOneProduct);

// place order
empRouter.post('/order/:empid/:proid', placeOrder);

// view orders
empRouter.get('/order/:name', readOrder);

export {empRouter};