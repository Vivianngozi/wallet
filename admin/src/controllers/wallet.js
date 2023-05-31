import Wallet from "../models/admin_wallet.js";

export async function admin_wallet(req, res) {
    try {
        const amount = await Wallet.find();
        if(amount){
            res.status(200).json(amount);
        } else{
            res.status(404).json({
                message: "You don't have any money yet"
            });
            return
        }
    } catch (error) {
        res.status(500).json(error);
        return;
    }
}