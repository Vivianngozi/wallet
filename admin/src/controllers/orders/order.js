import Goods from "../../models/orders.js";



export async function readOrder (req, res){
    try {
            const goods = await Goods.find();
            res.status(200).json(goods);
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}