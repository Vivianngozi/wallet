import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../../../admin/src/models/employee.js";

// login to employee account
export async function login (req, res) {
    const { username, password } = req.body;

    try {
        let employe = await Employee.findOne({
            username
        });

        if(!employe) {
            return res.status(404).json({
                message: "You are not an employee"
            });
        }

        const isMatch = await bcrypt.compare(password, employe.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const payload = {
            id: employe.id
        };

        jwt.sign (
            payload,
            process.env.SECRET,
            {
                expiresIn: "2h"
            },
            (err, token)=>{
                if(err) throw err;
                res.status(200).json({token});
            }
        )
    } catch(error) {
        res.status(500).json(error);
    }
}

 
// get single employee details
export async function readOne (req, res) {
    try{
        const employe = await Employee.findOne({_id: req.params.id});
        if(employe){
            return res.status(200).json({
                Employee: employe.username,
                balance: employe.balance
            })
        } else {
            return res.status(404).json({
                message: "user doesn/'t exist"
            })
        }
    } catch(error){
        res.status(500).json(error.message)
    }
}