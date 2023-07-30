import Wallet from "../models/admin_wallet.js";

export async function admin_wallet(req, res) {
    try {

        const wallet = await Wallet.findOne({admin: req.user});
        res.status(200).json({
            Amount: wallet.amount
        });

    } catch (error) {
        res.status(500).json(error);
        return;
    }
}