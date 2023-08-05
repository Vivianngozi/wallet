import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    favouriteColor: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    otp: {
        type: Number,
        default: null
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

export default mongoose.model("Employee", employeeSchema);