import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
      }
});


export default mongoose.model("Admin", adminSchema);