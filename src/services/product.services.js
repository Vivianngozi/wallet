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

export async function viewAllProduct ({page = 1, limit = 10} = req.query){
    
    const product= await Product.find()
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await Product.count();

    if(!product){
        return{
            message: "No product available"
        }
    } 
    return{
        Data: product,
        totalPage: Math.ceil(count / limit),
        currentPage: page
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