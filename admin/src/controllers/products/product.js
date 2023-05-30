import mongoose from "mongoose";
import Product from "../../models/products.js";

// create a product
export async function createProduct (req, res){
    try {
        const product = await Product.create({
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            product_description: req.body.product_description
        });
        res.status(201).json({
            product: product.product_name,
            price: product.product_price,
            Description: product.product_description
        });
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
        const products = {
            product_name : req.body.product_name,
            product_price: req.body.product_price,
            product_description: req.body.product_description
        };

        const product = await Product.findOneAndUpdate({_id: req.params.id}, products, {new: true});
        if(product){
            res.status(201).json(product)
        } else {
            res.status(404).json({
                message: "Product does not exist"
            })
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// delete
export async function deleteProduct (req, res) {
    try {
        const product = await Product.findByIdAndDelete({_id: req.params.id});
        if(product){
            res.status(204).json(null)
        } else{
            res.status(404).json({
                message: "Product not found"
            })
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}