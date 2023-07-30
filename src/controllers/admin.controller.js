import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendEmail} from "../utils/sendEmail.js";
import Admin from "../models/admin.js";
import Order from "../models/orders.js";
import {createEmployee,deleteEmployee, getEmployee, getSingleEmployee, payEmployee } from '../services/employee.service.js'

// register an admin
export async function register(req, res) {
    const {email, password} = req.body;
    try{
        let admin = await Admin.findOne({ email });

        if(admin){
            return res.status(400).json({
                message: "Account already exist"
            });
        }

        admin = new Admin({email });

        admin.password = await bcrypt.hash(password, 10);
        await admin.save();

        res.status(201).json({token: jwt.sign({ id: admin.id, admin: true },process.env.SECRET)})
        
    } catch(error){
        res.status(500).json(error);
        console.log(error)
    }
    
}


// login for an admin
export async function login (req, res){
    const {email, password} = req.body;
    try {
        let admin = await Admin.findOne({
            email
        });

        if(!admin || !await bcrypt.compare(password, admin.password)){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const payload = {
            id: admin.id
        };
        res.status(200).json({
            data: payload,
            token: jwt.sign( payload,process.env.SECRET)
        })
    } catch (error) {
       res.status(500).json(error) 
    }
}


export async function forgetPassword(req, res){
    try {
        const {email}= req.body;
        
        if(typeof email != "string" || email.length == 0 || !email.includes("@")){
            res.status(400).json({email:"Email is required or is not in the right format"});
            return;
        };
        const admin = await Admin.findOne({email});
        if(!admin){
            res.status(404).json({admin: "Admin does not exist"});
            return;
        }else{

        const random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        await Admin.findOneAndUpdate({email}, {otp: random});
        const str = random.toString()
        await sendEmail(admin.email, "Password reset", `This is the reset code: ${str}`);
        
        setTimeout(async()=>{
            await Admin.findByIdAndUpdate(admin._id, {otp: null})
        }, 120000);
        res.status(200).json({message:"password reset code sent to your email account"}); 
        }
} catch (error) {
        res.status(404).json("An error occured");
        console.log(error.message);
    }
}


// insert your otp
export async function passwordReset(req, res){
    try {
    const {otp, password} = req.body;
    if (typeof otp !="number"){
        res.status(401).json({
            otp: "incorrect input"
        });
        return;
    }

    if(typeof password !="string" || password.length < 4){
        res.status(404).json({
            password: "Password must be a string and grreater than 4"
        });
        return;
    }
    const admin = await Admin.findOne({otp});
    if(!admin){
        res.status(400).json({
            message: "Invalid otp or otp has expired"
        });
        return;
    }

    const pass = await bcrypt.hash(password, 10);

    await Admin.findByIdAndUpdate(admin._id, {password: pass, otp: null});
    res.status(200).json({
        message: "Password Updated Successfully"
    })
    } catch (error) {
       res.status(500).json({
        message: "internal server error"
       });
       console.log(error)
    }

}


export async function readOrder (req, res){
    try {
            const orders = await Order.find();
            res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}

export async function getBalance(req, res) {
    try {

        const wallet = await Admin.findOne({_id: req.user}).select('amount');
        res.status(200).json({
           wallet
        });

    } catch (error) {
        res.status(500).json(error);
        return;
    }
}

export async function createEmployees(req, res){
    try {
        const { username, password} = req.body;
        let errors=[]
        if(typeof username != "string" || username.length == 0){
            errors.push({username: "Username is required or is not in the right format"})
        }
    
        if(typeof password != "string" || password.length < 4){
            errors.push({password: "Password is required or is not in the right format"})
        }
        if (errors.length > 0){
            res.status(400).json(errors)
        }

        const employee = await createEmployee(req.body)
        res.status(employee.message['username']? 201 : 400).json({...employee})
    } catch (error) {
        res.status(500).json(error);
        console.log(error)
    }
}

export async function getAllEmployees (req, res){
    res.status(200).json(await getEmployee() )
}

export async function getOneEmployee (req, res){
    res.status(200).json(await getSingleEmployee(req.params.id) )
}

export async function payOneEmployee(req, res){
    let errors=[];
    if(typeof req.body.amount != "number" ){
        errors.push({amount: "amount is required or is not a number"})
    }

    if (errors.length > 0){
        res.status(400).json(errors);
        return;
    }
    res.status(200).json({...await payEmployee(req.params.id, req.body.amount)})
}

export async function deleteOneEmployee (req, res){
    res.status(200).json({...await deleteEmployee(req.params.id)})
}
