import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: {
        type: String,
        required:true
    },

    avatar:{
        type: String
    },
    cloudinary_id:{
        type: String
    }

}, {timestamps: true});

export default mongoose.model("Image", imageSchema);