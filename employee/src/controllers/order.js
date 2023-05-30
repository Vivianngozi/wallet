import Goods from "../../../admin/src/models/orders.js";
import Product from "../../../admin/src/models/products.js";
import Employee from "../../../admin/src/models/employee.js";

// create order
export async function placeOrder (req, res) {
    try {
        const employeeid = await Employee.findById({_id: req.params.empid});
        const productid = await Product.findOne({_id: req.params.proid});
        if (!employeeid || !productid){
            res.status(404).json({
                message: "This doesn't exist"
            })
        }

        const {employeeName, productName, quantity} = req.body;
        const amount = employeeid.balance
        const prodPrice = productid.product_price;
        const total_price = quantity * prodPrice;
        const username = employeeid.username;
        const product_name = productid.product_name
        if(employeeName != username){
            res.status(404).json({
                message: "This is an incorrect name, please use the name that was assigned to you"
            });
            return
        }
        if(productName != product_name){
            res.status(404).json({
                message: "This is an incorrect name, please use the name that was assigned to the product"
            });
            return
        }
        if (total_price > amount){
            res.status(405).json({
                message: "Insufficient Fund"
            });
            return;
        }
        
        

        let newBal = amount - total_price;
        const updateBal = await Employee.findByIdAndUpdate({_id: req.params.empid}, {balance: newBal}, {new: true});

        const goods = new Goods({
            employeeName, productName, quantity, total_price
        });
        await goods.save().then(()=>{
            res.status(200).json({
                message: "You have successfully purchased some products",
                data: goods
            })
        }).catch((err)=>{
            res.status(400).json(err.message)
        })
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error)
    }
}

// read order
export async function readOrder (req, res){
    try {
        const goods = await Goods.find({employeeName: req.params.name});

        if(goods){
            res.status(200).json(goods);
        } else{
            res.status(404).json({
                message: "No product ordered"
            })
        }
        
    } catch (error) {
        res.status(500).json(error.message);
    }
    
}