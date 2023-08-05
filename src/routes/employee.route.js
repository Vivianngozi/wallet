import express from 'express';
const empRouter = express.Router();
import { login, placeOrder, allOrders, profile, forgetPassword} from "../controllers/employee.controller.js";
import { jwtValidator } from '../middleware/authentication.js';

// login employee
empRouter.post('/login', login);

// get details
empRouter.get('/', jwtValidator, profile);

// place order
empRouter.post('/order', jwtValidator, placeOrder);


// view orders
empRouter.get('/order', jwtValidator, allOrders);

// forget password
empRouter.put('/forget-password', forgetPassword)

empRouter.all('*', function(req, res){
    res.status(404).json({
        "message": "Page does not exist"
    });
  });

export default empRouter;