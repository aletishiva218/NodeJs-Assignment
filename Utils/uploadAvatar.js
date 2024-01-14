import multer from "multer";
import path from "path";
const uploadAvatar = multer({
    storage:multer.diskStorage({
        destination: (req,file,cb)=> { cb(null,"Avatars") },
        filename: (req,file,cb) => { cb(null,"user"+Date.now()+path.extname(file.originalname)) }   
    }),
    fileFilter: function (req, file, cb) {
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
        cb(null, true);
        else {
            return cb(new Error("Only .png, .jpg, .jpeg format are allowed"))
        }
      }
}).single("profileImage")

export default uploadAvatar;