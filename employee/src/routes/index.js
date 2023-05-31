import express from 'express';
const empRouter = express.Router();
import { login, readOne } from "../controllers/employee_side.js";
import { viewAllProduct, viewOneProduct } from "../controllers/product.js";
import { placeOrder, readOrder } from "../controllers/order.js";
import { jwtValidator } from '../middleware/authentication.js';

// login employee
empRouter.post('/login/employee', login);

// get details
empRouter.get('/employeeDetail/:id', jwtValidator, readOne);

// view all products
empRouter.get('/product', jwtValidator, viewAllProduct);

// view one product
empRouter.get('/product/:id', jwtValidator, viewOneProduct);

// place order
empRouter.post('/order/:admid/:empid/:proid/:prodName', jwtValidator, placeOrder);

// view orders
empRouter.get('/order/:empId', jwtValidator, readOrder);


empRouter.all('*', function(req, res){
    res.status(404).json({
        "message": "not found"
    });
  });

export {empRouter};