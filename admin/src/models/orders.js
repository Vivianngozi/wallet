import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    employeeName: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number
    }
}, {timestamps: true});

export default mongoose.model("Goods", orderSchema);