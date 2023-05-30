import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    balance: {
        type: Number,
        required: true,
        default: 0
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

export default mongoose.model("Employee", employeeSchema);