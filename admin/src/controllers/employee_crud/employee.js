import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Employee from "../../models/employee.js";


// create employee
export async function createEmployee (req, res) {
    const { username, balance, password} = req.body;

    try {
        let employee = await Employee.findOne({
            username
        });

        if(employee) {
            return res.status(400).json({
                message: "User already exist"
            });
        }

        employee = new Employee({
            username,
            balance
        });

        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(password, salt);
        await employee.save().then(()=>{
            res.status(201).json(employee);
        }).catch((err)=>{

            res.status(400).json(err.message);
        });
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error)
    }
}


// read all employee
export async function readEmployee (req, res){
    try {
        const employData = await Employee.find();
        res.status(200).json(employData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


// update employee balance
export async function updateEmployee (req,res) {

    try {
        const old = await Employee.findOne({_id: req.params.empid});
        const oldamount = old.balance;
        let newAmount = req.body.balance;
        let balTotal = oldamount + newAmount;

        const updateBal = await Employee.findOneAndUpdate({_id: req.params.empid}, {balance: balTotal}, {new: true});
        if(updateBal) {
            return res.status(200).json(updateBal);
            
        } else {
            return res.status(404).json({
                "message": "not found"
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
        const deleteEmp = await Employee.findByIdAndDelete(req.params.empid);
        if(deleteEmp){
            return res.status(204).json(null);
        } else{
            res.status(404).json({
                message: "Not found"
            })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

