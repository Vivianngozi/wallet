import express from 'express';
const empRouter = express.Router();
import { login, readOne } from "../controllers/employee_side.js";
import { viewAllProduct, viewOneProduct } from "../controllers/product.js";
import { placeOrder, readOrder, updateOrder, deleteOrder } from "../controllers/order.js";
import { forgetPassword, resetPassword } from "../controllers/employee_passwordReset.js";
import { jwtValidator } from '../middleware/authentication.js';

// login employee
empRouter.post('/login/employee', login);

// get details
empRouter.get('/', jwtValidator, readOne);

// view all products
empRouter.get('/product', jwtValidator, viewAllProduct);

// view one product
empRouter.get('/product/:id', jwtValidator, viewOneProduct);

// place order
empRouter.post('/order', jwtValidator, placeOrder);


// view orders
empRouter.get('/order', jwtValidator, readOrder);


empRouter.post('/forget-password/:id', forgetPassword)
empRouter.post('/reset-password', resetPassword);

empRouter.all('*', function(req, res){
    res.status(404).json({
        "message": "Page does not exist"
    });
  });

export {empRouter};