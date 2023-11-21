import multer from "multer";

const storage = multer.diskStorage({
    destination:'uploads',
    function(req,file, cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            cb(null, './file/images/')
        } else{
            cb({message: 'This file is neither a video or image file'}, false)
        }
    },
    filename: function(req, file, cb){
        let unique = Date.now() + '-' + Math.round(Math.random() *1E9);
        cb(null, unique + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage}).single('image');


export  {upload};