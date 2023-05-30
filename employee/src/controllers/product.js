import Product from "../../../admin/src/models/products.js";

// view all products
export async function viewAllProduct (req, res) {
    try {
        const product = await Product.find();
        if(product) {
            res.status(200).json(product);
        } else{
            res.status(404).json({
                message: "not found"
            })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// view one product
export async function viewOneProduct (req, res){
    try {
        const product = await Product.findOne({_id: req.params.id});
        if(product){
            res.status(200).json(product)
        } else {
            res.status(404).json({
                message: "not found"
            })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}