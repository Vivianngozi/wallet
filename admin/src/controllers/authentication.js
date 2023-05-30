import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

// register an admin
export async function register(req, res) {
    const {email, username, password} = req.body;

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
            username
        });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        await admin.save();

        const payload = {
            id: admin.id
        };

        jwt.sign(
            payload,
            process.env.SECRET, {
                expiresIn: 10000
            },
            (err, token)=> {
                if(err) throw err;
                res.status(201).json(token);
            }
        )
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

        if(!admin){
            return res.status(404).json({
                message: "Admin not found"
            })
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Incorrect Password"
            });
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
                res.status(200).json({token});
            }
        )
    } catch (error) {
       res.status(500).json(error) 
    }
}


