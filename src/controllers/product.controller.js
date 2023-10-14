import {Product} from "../models/index.js";
import {createProduct, viewAllProduct, deleteProduct, viewOneProduct, updateProduct} from "../services/product.services.js";
import { createClient } from 'redis';

let redisClient;

(async () => {
    redisClient = createClient();

    redisClient.on("error", err => console.log('Redis Client Error', err));

    await redisClient.connect();

})();


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
    let results;
    let isCached = false;
    try {

        const cacheResults = await redisClient.get("cacheProduct");
        if (cacheResults){
            isCached = true;
            results = JSON.parse(cacheResults);
        } else {
            results = await viewAllProduct(req.query);
            if(results.length === 0) {
                throw "API returned an empty array";
            }
            await redisClient.set("cacheProduct", JSON.stringify(results), {
                EX: 172800,
                NX: true,
            });
        }

        let result = await viewAllProduct(req.query);
        res.status(200).json({fromCache: isCached, result});

         
    
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