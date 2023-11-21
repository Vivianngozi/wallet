const multer  = require('multer');
// multer.diskStorage() create storage space
const storage = multer.diskStorage({
    destination: function(req, file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            cb(null, './files/images/')
        } else{
            cb({message: 'This file is neither a video or image file'}, false)
        }
    },
    filename: function(req, file, cb){
        let unique = Date.now() + '-' + Math.round(Math.random() *1E9);
        cb(null, unique + '-' +file.originalname);
    }
});

const upload = multer({ storage:storage});

export default upload;