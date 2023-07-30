import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
const app = express();
import bodyParser from 'body-parser';
import DB from './db.js';
import adminRoute  from './routes/admin.route.js';
import employeeRoute from './routes/employee.route.js'; 
DB.connect();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/admin', adminRoute);
app.use('/employee', employeeRoute);

app.get('/health', (req, res)=>{
    res.status(200).json({
        message: "server is running"
    });
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('server started');
})