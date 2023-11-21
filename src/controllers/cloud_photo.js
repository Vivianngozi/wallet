// for uploading straight to straight to cloundinary
import sharp from 'sharp';
import { Photo } from '../models/index.js';
import {v2 as cloudinary} from 'cloudinary';
import { Readable } from 'stream';
import { error } from 'console';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
   });
const bufferToStream = (buffer) => {
    const readable = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        },
    });
    return readable;
}
export async function image (req, res) {
    try {

    const data = await sharp(req.file.buffer).webp({quality: 20}).toBuffer();
    const stream = cloudinary.uploader.upload_stream(
        { folder: "DEV" },
        (error, result) => {

            let photos = new Photo({
                cloudImage: result.secure_url,
                imageId:result.public_id
            });
            photos.save();
            if (error) return console.error(error);
            
            return res.json({ URL: result.secure_url});
        }
    );
    bufferToStream(data).pipe(stream);
    
 } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong"
        })
 }
}

// Get image
export async function cloudGet (req, res){
    try {
        res.status(200).json({
            detail: await Photo.find()
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong"
        });
    }
}

// Delete image

export async function deletePhoto (req, res){
    try {
        const image = await Photo.findById(req.params.id);
        // delete from cloundinary
        await cloudinary.uploader.destroy(image.imageId);
        // delete from db
        await Photo.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Image Deleted Successfully"
        });
        return;

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong, try again later."
        })
        return;
    }
}

// Update photos
export async function updatePhoto (req, res){
    try {
        let photo = await Photo.findById(req.params.id);
        // delete image from cloudinary
        await cloudinary.uploader.destroy(photo.imageId);

        const data = await sharp(req.file.buffer).webp({quality: 20}).toBuffer();
        const stream = cloudinary.uploader.upload_stream(
            {folder: "Dev"},
            async (error, result) => {
                // let data = {
                //     cloudImage: result.secure_url,
                //     imageId: result.public_id 
                // };
                const photos = await Photo.findByIdAndUpdate(req.params.id, {
                    cloudImage: result.secure_url,
                    imageId: result.public_id 
                }, {
                    new: true
                });

                if(error) return console.error(error);
                return res.status(200).json({ data: photos})
            }
        );
        bufferToStream(data).pipe(stream);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong"
        });
    }
}