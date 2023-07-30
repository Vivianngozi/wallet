import Admin from "../models/admin.js";
import {sendEmail} from "../controllers/sendEmail.js";
import bcrypt from "bcryptjs";

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

        let otp = await Admin.findOneAndUpdate({email}, {otp: random}, {new: true});
        
        res.status(200).json({message:"password reset code sent to your email account"});
        setTimeout(async()=>{
               await Admin.findByIdAndUpdate(admin._id, {otp: null})
        }, 120000);
        
        const str = random.toString()
        await sendEmail(admin.email, "Password reset", `This is the reset code: ${str}`);

        

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
