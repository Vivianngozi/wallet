import Admin from "../../../admin/src/models/admin.js";
import {sendEmail} from "../../../admin/src/controllers/sendEmail.js";
import bcrypt from "bcryptjs";
import Employee from "../../../admin/src/models/employee.js";

export async function forgetPassword(req, res){
    try {
        const {email} = req.body;
        if(typeof email != "string" || email.length == 0 || !email.includes("@")){
            res.status(400).json({
                message: "Email is required or is not in the right format"
            });
            return;
        }
            const admin = await Admin.findOne({email});
            if(!admin){
                res.status(404).json({
                    message: "Admin not found"
                });
                return;
            }
            const random = Math.floor(Math.random() * (999999 - 100000 + 1))+ 100000;

            let otp = await Employee.findByIdAndUpdate({_id: req.params.id}, {otp: random}, {new: true});

            res.status(200).json({message:"password reset Code sent to your email account"});

            let employee = await Employee.findOne({_id: req.params.id});

            setTimeout(async()=>{
                await Employee.findByIdAndUpdate(employee, {otp: null})
            }, 120000);

            const str = random.toString()
            await sendEmail(admin.email, "Password reset", `This is the reset code: ${str}`);
            

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured"
        })
    }
}


export async function resetPassword(req, res) {
    try {
        const {otp, password} = req.body;
        if(typeof otp != "number"){
            res.status(400).json({
                message: "Incorrect Input"
            });
            return;
        }
        if(typeof password != "string" || password.length < 4){
            res.status(400).json({
                message: "Password must be a string and must be greater than 4"
            });
            return;
        }
        const employee = await Employee.findOne({otp});
        if(!employee){
            res.status(400).json({
                message: "Invalid otp or otp has expired"
            });
            return;
        }

        const pass = await bcrypt.hash(password, (10));

        await Employee.findByIdAndUpdate(employee._id, {password: pass, otp: null});
        res.status(200).json({
            message: "Password Updated Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        });
        console.log(error)
    }
}