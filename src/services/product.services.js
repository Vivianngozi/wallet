import Product from "../models/products.js";


export async function createProduct (payload){
    try {
        const {name, price, quantity, description} = payload;

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

export async function viewAllProduct (){
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export async function viewOneProduct (id){
    try{
        const product = await Product.findById(id);
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

export async function updateProduct (id, payload){
    try {
        
        let {name, price, description, quantity} = payload;
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
        const product = await Product.findById(id);
        if(!quantity){
            quantity = 0;
        }
        const new_quantity = product.quantity + quantity;
      

        const updateproduct = await Product.findOneAndUpdate({_id: id}, {name, price, quantity: new_quantity, description});
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

export async function deleteProduct (id) {
    try {
        const product = await Product.findByIdAndDelete(id);
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