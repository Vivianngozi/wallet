import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({

    cloudImage: {
        type: String,
    },
    imageId: {
        type: String,

    }
}, {timestamps: true});

export default mongoose.model("Photo", imageSchema);