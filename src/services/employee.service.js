import bcrypt from "bcryptjs";
import {Employee, Product, Order} from "../models/index.js";


// create employee
export async function createEmployee ({username, age, favouriteColor, password}) {
    let employee = await Employee.findOne({
        username
    });

    if (employee) {
        return {
            message: "Employee already exist with this username"
        };
    }

    employee = new Employee({
        username,
        age,
        favouriteColor
    });

    employee.password = await bcrypt.hash(password, 10);
    await employee.save();

    return{
        message: await Employee.findOne({ _id: employee._id }).select('-password')
    };  
   
}


// read all employee
export async function getEmployee ({page = 1, limit = 10} = req.query){
    const employee = await Employee.find().select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await Employee.count();
    if(!employee){
        return{
            message: " No product found "
        }
    }
    return{
        Data: employee,
        totalPage: Math.ceil(count / limit),
        currentPage: page
    }
    // return await Employee.find().select('-password');
}

// get single employee
export async function getSingleEmployee(id) {
    return await Employee.findById(id).select("-password");
       
}


// update employee balance
export async function payEmployee (id, amount) {
    try {    
    let employee = await Employee.findOne({_id: id});
    if (!employee){
        return {
            "message": "Employee not found"
        }
    }

    employee.balance += amount;
    await employee.save()
    return { message: "Payment successful"} 
    } catch (error) {
    console.log(error)
    }
}


// delete employee account
export async function deleteEmployee (id) {
    const deleteEmp = await Employee.findByIdAndDelete(id);
    if(deleteEmp){
        return {
            message: "Employee Deleted successfully"
        };
    } else{
        return {
            message: "Employee not found"
        }
    }
}

// forget password
export async function forgetOnePassword({ username, age, favouriteColor, password}){
    const employee = await Employee.findOne({username});
    if(!employee || employee.age != age || employee.favouriteColor != favouriteColor){
        return{
            message: "Invalid credentials"
        }
    }

    employee.password = await bcrypt.hash(password, 10);
    employee.save();

    return{
        message: "password has ben updated"
    }
    
}

