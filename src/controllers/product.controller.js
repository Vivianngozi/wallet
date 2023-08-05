import {Product} from "../models/index.js";
import {createProduct, viewAllProduct, deleteProduct, viewOneProduct, updateProduct} from "../services/product.services.js";

export async function createProducts(req, res){
    try {
        let {name, price, quantity, description} = req.body;

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

        res.status(200).json(await createProduct(req.body))
    } catch (error) {
        res.status(500).json(error);
        console.log(error)
    }
}


// read all product
export async function viewAllProducts(req, res){
    try {
        res.status(200).json(await viewAllProduct())
    } catch (error) {
        res.status(500).json({
            message: "An error has occured"
        })
        console.log(error)
    }
}

// read one product
export async function viewSingleProduct(req, res){
    try {
        res.status(200).json(await viewOneProduct(req.params.id));
    } catch (error) {
        res.status(500).json(error.message);
        console.log(error)
    }
}

// update product
export async function updateOneProduct(req, res){
    try{
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
        res.status(200).json({...await updateProduct(req.params.id, req.body)})
    }
    catch(error){
        res.status(500).json({
            message: "An error has occur"
        });
        console.log(error)
    }

}

// delete a product
export async function deleteOneProduct(req, res){
    try{
    res.status(200).json({...await deleteProduct(req.params.id)})
    }
    catch(error){
        res.status(500).json({
            message: "An error has occured"
        });
        console.log(error)
    }
}