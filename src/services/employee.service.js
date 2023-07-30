import bcrypt from "bcryptjs";
import Employee from "../models/employee.js";


// create employee
export async function createEmployee ({username, password}) {
    let employee = await Employee.findOne({
        username
    });

    if (employee) {
        return {
            message: "Employee already exist with this username"
        };
    }

    employee = new Employee({
        username
    });

    employee.password = await bcrypt.hash(password, 10);
    await employee.save();

    return{
        message: await Employee.findOne({ _id: employee._id }).select('-password')
    };  
   
}


// read all employee
export async function getEmployee (){
    return await Employee.find().select('-password');
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

