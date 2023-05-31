import mongoose from "mongoose";
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    amount: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("wallet", walletSchema);