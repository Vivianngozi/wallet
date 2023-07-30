import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Employee, Order } from "../models/index.js";

// login to employee account
export async function login(req, res) {

    try {
        const { username, password } = req.body;
        let errors = []
        if (typeof username != "string" || username.length == 0) {
            errors.push({ username: "Username is required or is not in the right format" })
        }

        if (typeof password != "string" || password.length < 4) {
            errors.push({ password: "Password is required or is not in the right format" })
        }
        if (errors.length > 0) {
            res.status(400).json(errors)
            return
        } 
        let employee = await Employee.findOne({
            username
        });

        if (!employee || !await bcrypt.compare(password, employee.password)) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const payload = {
            id: employee.id
        };
        res.status(200).json({ data: await Employee.findOne({ username}).select('-password'), token: jwt.sign(payload, process.env.SECRET) });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}


// get single employee details
export async function profile(req, res) {
    try {
        const employe = await Employee.findOne({ _id: req.user });
        if (employe) {
            return res.status(200).json({
                username: employe.username,
                balance: employe.balance
            })
        } else {
            return res.status(404).json({
                message: "Account doesn't exist"
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function placeOrder(req, res) {
    try {
        const { quantity, productId } = req.body;
        let errors = []
        if (typeof quantity != "number" || quantity === 0) {
            errors.push({ quantity: "quantity is required or is not supported" })
        }

        if (typeof productId != "string" ) {
            errors.push({ productId: "product id is required or is not in the right format" })
        }
        if (errors.length > 0) {
            res.status(400).json(errors)
            return 
        }
     
            let employee = await Employee.findOne({ _id: req.user });
            let product = await Product.findOne({ _id: productId });

            if (!employee ) {
                res.status(404).json({
                    message: "Employee doesn't exist"
                });
                return;
            }
            if (!product ) {
                res.status(404).json({
                    message: "Product doesn't exist"
                });
                return;
            }

            if (product.quantity < quantity){
                res.status(200).json({
                    message: "Quantity requested is more than what is available in stock"
                });
                return;
            }
            
            const total_price = quantity * product.price;
            if (total_price > employee.balance) {
                res.status(200).json({
                    message: "Insufficient Fund"
                });
                return;
            }
                     
            employeeid.balance -= total_price;
            await employee.save()
            const orders = new Order({
                employee: employee._id, product: product._id, quantity, total_price
            });
           let order= await orders.save()
            res.status(200).json({
                message: "You have successfully purchased some products",
                data: orders
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    export async function allOrders (req, res){
        try {
            const orders = await Orders.find({employeeId: req.user});
    
            res.status(200).json(orders);
         
        } catch (error) {
            res.status(500).json(error.message);
        }
        
    }
