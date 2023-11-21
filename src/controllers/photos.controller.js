import { Image } from "../models/index.js";
import { cloudinary } from "../utils/cloudinaryConfig.js";


export async function createImage(req, res){
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        let photo = new Image({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
        });

        await photo.save();
        res.status(201).json(photo);
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong, try again later"
        })
        console.log(error);
        return;
    }
}


export async function getImage(req, res) {
    try {
        res.status(200).json({
            data: await Image.find()
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong"
        })
    }
}

export async function deleteImage(req, res){
    try {
        const image = await Image.findById(req.params.id);
        // delete from cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_id);
        // delete from db
        await Image.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Deleted successfully"
        });
        return;
    } catch (error) {
        res.status(400).json({
            message: "Internal server error"
        });
        console.log(error);
    }
}