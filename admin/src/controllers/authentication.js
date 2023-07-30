import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import wallet from "../models/admin_wallet.js";

// register an admin
export async function register(req, res) {
    const {email, password} = req.body;
    let errors=[]
    if(typeof email != "string" || email.length == 0 || !email.includes("@")){
        errors.push({email: "Email is required or is not in the right format"})
    }

    if(typeof password != "string" || password.length < 4){
        errors.push({password: "Password is required or is not in the right format"})
    }
    if (errors.length > 0){
        res.status(400).json(errors)
    } else {
        try{
            let admin = await Admin.findOne({
                email
            });
    
            if(admin){
                return res.status(400).json({
                    message: "Account already exist"
                });
            }
            if(!process.env.SECRET){
                return res.status(400).json({
                    message: "check your code"
                });
            }
    
            admin = new Admin({
                email,
            });
    
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
            await admin.save();

            wallet.create({
                admin: admin._id
            })
    
            const payload = {
                id: admin.id
            };
    
            jwt.sign(
                payload,
                process.env.SECRET,
                (err, token)=> {
                    if(err) throw err;
                    res.status(201).json({token: token});
                }
            )

            

        } catch(error){
            res.status(500).json(error);
            console.log(error)
        }
    }
}


// login for an admin
export async function login (req, res){
    const {email, password} = req.body;

    let errors = [];
    if(typeof email != "string" || email.length == 0 || !email.includes("@")){
        errors.push({email: "Email is required or is not in the right format"});
        return;
    }

    if(typeof password != "string" || password.length < 4){
        errors.push({password: "Password is required or is not in the right format"});
        return;
    }
    if (errors.length > 0){
        res.status(400).json(errors);
        return;
    }  

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

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: "2h"
            },
            (err, token)=> {
                if(err) throw err;
                res.status(200).json({
                    data: payload,
                    token: token});
            }
        )

    } catch (error) {
       res.status(500).json(error) 
    }
}


