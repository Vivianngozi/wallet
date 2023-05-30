import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_description: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model("Product", productSchema);