import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
      }
});


export default mongoose.model("Admin", adminSchema);