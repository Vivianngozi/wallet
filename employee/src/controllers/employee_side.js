import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../../../admin/src/models/employee.js";

// login to employee account
export async function login (req, res) {
    
    try {
        const { username, password } = req.body;
        let errors=[]
    if(typeof username != "string" || username.length == 0){
        errors.push({username: "Username is required or is not in the right format"})
    }

    if(typeof password != "string" || password.length < 4){
        errors.push({password: "Password is required or is not in the right format"})
    }
    if (errors.length > 0){
        res.status(400).json(errors)
    } else {
        let employe = await Employee.findOne({
            username
        });

        if(!employe || !await bcrypt.compare(password, employe.password)){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const payload = {
            id: employe.id
        };
        const details = await Employee.findOne({username: employe.username}).select('-password')

        jwt.sign (
            payload,
            process.env.SECRET,
            (err, token)=>{
                if(err) throw err;
                res.status(200).json({
                    data: details,
                    token});
            }
        )
    }} catch(error) {
        res.status(500).json(error);
    }
}

 
// get single employee details
export async function readOne (req, res) {
    try{
        const employe = await Employee.findOne({_id: req.user});
        if(employe){
            return res.status(200).json({
                username: employe.username,
                balance: employe.balance
            })
        } else {
            return res.status(404).json({
                message: "Account doesn't exist"
            })
        }
    } catch(error){
        res.status(500).json(error.message)
    }
}