import {Admin} from "../models/index.js";
export async function userAuthValidator (req, res, next){
    const admin = await Admin.findById({_id: req.user});
    if(!admin){
        res.status(401).json({
            message: "You are not authorize to view this page"
        });
        return;
    };
    next();
}
