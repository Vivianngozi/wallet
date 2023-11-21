import express from 'express';
const router = express.Router();
import { adminAccess, viewAdminDetails, createEmployees, deleteOneEmployee, forgetPassword, getAllEmployees, getBalance, getOneEmployee, passwordReset, payOneEmployee, readOrder } from '../controllers/admin.controller.js';
import { jwtValidator } from '../middleware/authentication.js';
import { adminAuthValidator} from '../middleware/validator.js';
import { multerUploads} from '../middleware/multer.js';
import {image, cloudGet, deletePhoto, updatePhoto } from '../controllers/cloud_photo.js';
import {upload} from '../utils/multer.js';
import { createImage, getImage, deleteImage } from '../controllers/photos.controller.js';

// register for admin
// router.post('/register', adminAuthValidator, register);
// router.post('/login',adminAuthValidator, login);
router.post('/access',adminAuthValidator, adminAccess);
router.get('/', viewAdminDetails);


// employee  
router.post('/employee', jwtValidator, createEmployees);
router.patch('/employee/pay/:id', jwtValidator, payOneEmployee);
router.get('/employee', jwtValidator, getAllEmployees);
router.get('/employee/:id', jwtValidator, getOneEmployee)
router.delete('/employee/:id', jwtValidator, deleteOneEmployee);


// view orders
router.get('/orders', jwtValidator, readOrder);

// view wallet
router.get('/wallet', jwtValidator, getBalance);

// reset password
router.post('/forget-password', forgetPassword);
router.post('/reset-password', passwordReset);

//photos
router.post('/photos', multerUploads, image);
router.get('/photos', cloudGet);
router.delete('/photos/:id', deletePhoto);
router.put('/photos/:id', multerUploads, updatePhoto);
//save in serve and save in cloudinary
router.post('/image', upload, createImage);
router.get('/image', getImage);
router.delete('/image/:id', deleteImage);

export default router;