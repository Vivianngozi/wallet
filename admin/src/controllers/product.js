import mongoose from "mongoose";
import Product from "../models/products.js";

// create a product
export async function createProduct (req, res){
    try {
        const {name, price, quantity, description} = req.body;

        let errors = [];
        if(typeof name != "string" || name.length == 0){
            errors.push({Product: "The product name is required or it is not the right format"})
        }
        if(typeof price != "number"){
            errors.push({price: "Price must be provided and must be a number"})
        }
        if(typeof quantity != "number"){
            errors.push({quantity: "Quantity must be provided and must be a number"})
        }
        if(typeof description != "string" || description.length == 0){
            errors.push({description: "Description must be provided and must be a string"})
        }
        if(errors.length > 0){
            res.status(400).json(errors);
            return;
        } 
            const product = await Product.create({
                name,
                price,
                quantity,
                description
            });
            res.status(201).json({
                id: product._id,
                Product: product.name,
                Price: product.price,
                Quantity: product.quantity,
                Description: product.description
            })

        
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error)
    }
}

// view all products
export async function viewAllProduct (req, res){
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// view one product
export async function viewOneProduct (req, res){
    try{
        const product = await Product.findById({_id: req.params.id});
        if(product){
            res.status(200).json(product);
        } else{
            res.status(404).json({
                message: "Not product found with this ID"
            })
        }
    }catch(error){
        res.status(500).json(error.message);
    }
}

// update
export async function updateProduct (req, res){
    try {
        
        let {name, price, description, quantity} = req.body;
        let errors = [];
        if(name && typeof name != "string"){
            errors.push({Name: "The product name is required or it is not the right format"})
        }
        if(price && typeof price != "number"){
            errors.push({price: "Price must be provided and must be a number"})
        }
        if(quantity && typeof quantity != "number"){
            errors.push({quantity: "Quantity must be provided and must be a number"})
        }
        if(description && typeof description != "string"){
            errors.push({description: "Description must be provided and must be a string"})
        }
        if(errors.length > 0){
            res.status(400).json(errors);
            return;
        } 
        const product = await Product.findById({_id: req.params.id});
        if(!quantity){
            quantity = 0;
        }
        const new_quantity = product.quantity + quantity;
      

        const updateproduct = await Product.findOneAndUpdate({_id: req.params.id}, {name, price, quantity: new_quantity, description}, {new: true});
        if(updateproduct){
            res.status(201).json(updateproduct)
        } else {
            res.status(404).json({
                message: "Product does not exist"
            })
        }

    } catch (error) {
        res.status(500).json(error.message);
        console.log(error)
    }
}

// delete
export async function deleteProduct (req, res) {
    try {
        const product = await Product.findByIdAndDelete({_id: req.params.id});
        if(product){
            res.status(200).json({
                message: "Deleted successfully"
            })
        } else{
            res.status(404).json({
                message: "Product not found"
            })
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}