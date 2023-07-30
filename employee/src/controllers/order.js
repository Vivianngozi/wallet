import Goods from "../../../admin/src/models/orders.js";
import Product from "../../../admin/src/models/products.js";
import Employee from "../../../admin/src/models/employee.js";
import Wallet from "../../../admin/src/models/admin_wallet.js";

// create order
export async function placeOrder (req, res) {
    try {
        const { quantity} = req.body;
        if(typeof quantity != "number"){
            res.status(401).json({
                message: "Input the right number of product needed"
            });
            return;
        }
        const employeeid = await Employee.findOne({_id: req.params.empid});
        const productid = await Product.findOne({_id: req.params.proid});
        const adminWallet = await Wallet.findById({_id: req.params.admid});

        if (!employeeid || !productid){
            res.status(404).json({
                message: "This doesn't exist"
            });
            return;
        }

        const total_price = quantity * productid.price;
        const originProdName = productid.name;
        const productName = req.params.prodName;
        if(productName != originProdName){
            res.status(404).json({
                message: "product not available"
            });
            return
        }

        if (total_price > employeeid.balance){
            res.status(405).json({
                message: "Insufficient Fund"
            });
            return;
        }
        
        let newBal = employeeid.balance - total_price;
        const newAdminAmount = adminWallet.amount + total_price;
        console.log(adminWallet.amount);
        
        let errors=[]
    

    if(productid.quantity < quantity){
        errors.push({password: `The quantity of product available is ${productid.quantity}`});
    }
    if (errors.length > 0){
        res.status(400).json(errors)
    } else {
        await Wallet.findByIdAndUpdate({_id: req.params.admid}, {amount: newAdminAmount}, {new: true});
        await Employee.findByIdAndUpdate({_id: req.params.empid}, {balance: newBal}, {new: true});
        await Product.findByIdAndUpdate({_id: req.params.proid}, {quantity: productid.quantity - quantity}, {new: true});

        const goods = new Goods({
            employeeId: employeeid._id, productName: originProdName, quantity, total_price
        });
        await goods.save().then(()=>{
            res.status(200).json({
                message: "You have successfully purchased some products",
                data: goods
            })
        }).catch((err)=>{
            res.status(400).json(err.message)
        })
    }} catch (error) {
        res.status(500).json(error.message)
        console.log(error)
    }
}


// read one order
export async function readOrder (req, res){
    try {
        const goods = await Goods.find({employeeId: req.user});

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


// update 
export async function updateOrder(req, res){
    try {
        const { quantity} = req.body;
        if(typeof quantity != "number"){
            res.status(401).json({
                message: "Input the right number of product needed"
            });
            return;
        }
        const goods = await Goods.findById({_id: req.params.ordId});
        const wallet = await Wallet.findById({_id: req.params.walletId});
        const product = await Product.findById({_id: req.params.proId});
        const employee = await Employee.findOne({_id: req.user});
        const totalPrice = quantity * product.price;
        if (totalPrice > employee.balance){
            res.status(405).json({
                message: "Insufficient Fund"
            });
            return;
        }

        await Product.findByIdAndUpdate({_id: product._id}, {quantity: product.quantity + (quantity - goods.quantity)});
        await Wallet.findByIdAndUpdate({_id: wallet._id}, {amount: wallet.amount + (totalPrice - goods.total_price)});
        await Employee.findByIdAndUpdate({_id: employee._id}, {balance: employee.balance + (totalPrice - goods.total_price)});
        const updateOrder = await Goods.findByIdAndUpdate({_id: goods._id}, {quantity: quantity, total_price: totalPrice});
        
        res.status(200).json({updateOrder})


    } catch (error) {
        
    }
}

// delete
export async function deleteOrder (req, res) {
    try {
        const goods = await Goods.findById({_id: req.params.ordId});
        const wallet = await Wallet.findById({_id: req.params.walletId});
        const product = await Product.findById({_id: req.params.proId});
        const employee = await Employee.findOne({_id: req.user});

        await Wallet.findByIdAndUpdate({_id: wallet._id},{amount: wallet.amount - goods.total_price});
        await Product.findByIdAndUpdate({_id: product._id}, {quantity: product.quantity + goods.quantity});
        await Employee.findByIdAndUpdate({_id: goods.employeeId}, {balance: employee.balance + goods.total_price});
        const deleteEmp = await Goods.findByIdAndDelete({_id: goods._id}, {new: true});
        if(!deleteEmp){
            res.status(404).json({
                message: "Order not found"
            })
            return;
        }
            res.status(204).json({
                message: "Order Deleted successfully"
            });

    } catch (error) {
        res.status(500).json(error.message);
        console.log(error)
        return;
    }
}