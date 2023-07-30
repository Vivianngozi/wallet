import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Employee from "../models/employee.js";


// create employee
export async function createEmployee (req, res) {
    
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
    } else {
        let employee = await Employee.findOne({
            username
        });

        if(employee) {
            return res.status(400).json({
                message: "Employee already exist with this username"
            });
        }

        employee = new Employee({
            username
        });

        employee.password = await bcrypt.hash(password, 10);
        await employee.save();
        
            res.status(201).json({
                message: await Employee.findOne({_id: employee._id}).select('-password')
            });
    }} catch (error) {
        res.status(500).json(error.message)
        console.log(error)
    }
}


// read all employee
export async function getEmployee (req, res){
    try {
        const employData = await Employee.find().select('-password');
        res.status(200).json({employData});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// get single employee
export async function getSingleEmployee(req, res) {
    try {
        const employData = await Employee.findById({_id: req.params.id}).select("-password");
        if(!employData){
            res.status(404).json({
                message: "not found"
            });
            return;
        } else{
            res.status(200).json({employData})
        }
    } catch (error) {
        console.log(error)
    }
}


// update employee balance
export async function payEmployee (req,res) {

    try {    
    const input_balance = req.body.amount 
    let errors=[];
    if(typeof input_balance != "number" || input_balance.length == 0){
        errors.push({balance: "balance is required or is not in the right format"})
    }

    if (errors.length > 0){
        res.status(400).json(errors);
        return;
    }
    const old = await Employee.findOne({_id: req.params.empid});
    let balTotal = old.balance + input_balance;

        const updateBal = await Employee.findOneAndUpdate({_id: req.params.empid}, {balance: balTotal}).select('-password');
        if(updateBal) {
            return res.status(200).json({
                Data: updateBal
            });
            
        } else {
            return res.status(404).json({
                "message": "Employee not found"
            });
        }
       } catch (error) {
        res.status(500).json(error.message);
        console.log(error)
    }
}

// delete employee account
export async function deleteAcc (req, res) {
    try {
        const deleteEmp = await Employee.findByIdAndDelete(req.params.id);
        if(deleteEmp){
            return res.status(204).json({
                message: "Employee Deleted successfully"
            });
        } else{
            res.status(404).json({
                message: "Employee not found"
            })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

