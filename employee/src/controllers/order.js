import Goods from "../../../admin/src/models/orders.js";
import Product from "../../../admin/src/models/products.js";
import Employee from "../../../admin/src/models/employee.js";
import Wallet from "../../../admin/src/models/admin_wallet.js";

// create order
export async function placeOrder (req, res) {
    try {
        const employeeid = await Employee.findById({_id: req.params.empid});
        const productid = await Product.findOne({_id: req.params.proid});
        const adminWallet = await Wallet.findById({_id: req.params.admid});
        const oldAdminAmount = adminWallet.amount;
        if (!employeeid || !productid){
            res.status(404).json({
                message: "This doesn't exist"
            })
        }

        const { quantity} = req.body;
        const amount = employeeid.balance
        const prodPrice = productid.product_price;
        const total_price = quantity * prodPrice;
        const originProdName = productid.product_name;
        const originEployId = employeeid._id;
        const employeeId = req.params.empid;
        const productName = req.params.prodName;

        if(productName != originProdName){
            res.status(404).json({
                message: "product not available"
            });
            return
        }

        if(employeeId != originEployId){
            res.status(404).json({
                message: "Who are you"
            });
            return;
        }

        if (total_price > amount){
            res.status(405).json({
                message: "Insufficient Fund"
            });
            return;
        }
        
        let newBal = amount - total_price;
        const newAdminAmount = oldAdminAmount + total_price;
        const updateAdminAmount = await Wallet.findByIdAndUpdate({_id: req.params.admid}, {amount: newAdminAmount}, {new: true});
        const updateBal = await Employee.findByIdAndUpdate({_id: req.params.empid}, {balance: newBal}, {new: true});

        const goods = new Goods({
            employeeId, productName, quantity, total_price
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
        const goods = await Goods.find({employeeId: req.params.empId});

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