import Product from "../models/products.js";


export async function createProduct (payload){

        const {name, price, quantity, description} = payload;
            const product = await Product.create({
                name,
                price,
                quantity,
                description
            });
            
            return{
                message: await Product.findOne({_id: product._id})
            }

    
}

export async function viewAllProduct (){
    const product= await Product.find();
    if(product){
        return{
            Data: product
        }
    } else{
        return{
            message: "No product available"
        }
    }
}

export async function viewOneProduct (id){
        const product = await Product.findById(id);
        if(product){
            return product;
        } else{
            return {
                message: "Not product found with this ID"
            }
        }

}

export async function updateProduct (id, payload){
    let {name, price, description, quantity} = payload;
        const product = await Product.findById({_id: id});
        if(!product){
            return {
                message: "Product doesn't exist"
            }
        }
        if(!quantity){
            quantity = 0;
        }

        const new_quantity = product.quantity + quantity;

        const updateproduct = await Product.findByIdAndUpdate({_id: product._id}, {name, price, quantity: new_quantity, description}, {new: true});

            return {
                updateproduct
            };
}

export async function deleteProduct (id) {
        const product = await Product.findByIdAndDelete(id);
        if(product){
            return {
                message: "Deleted successfully"
            };
        } else{
            return{
                message: "Product not found"
            }
        }

}