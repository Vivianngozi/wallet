import express from 'express';
const prodRouter = express.Router();
import { createProducts, viewAllProducts, viewSingleProduct, updateOneProduct, deleteOneProduct} from '../controllers/product.controller.js';
import { jwtValidator } from '../middleware/authentication.js';
import { userAuthValidator} from '../middleware/product_validator.js'

prodRouter.post('/create', jwtValidator, userAuthValidator, createProducts);
prodRouter.get('/', jwtValidator, viewAllProducts);
prodRouter.get('/:id', jwtValidator, viewSingleProduct);
prodRouter.put('/:id', jwtValidator, userAuthValidator, updateOneProduct);
prodRouter.delete('/:id', jwtValidator, userAuthValidator, deleteOneProduct);



export default prodRouter;