import adminModel from "../../Database/Models/adminModel.js";
import userModel from "../../Database/Models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import uploadAvatar from "../../Utils/uploadAvatar.js";
import multer from "multer";
dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const signup = (req,res) => {
    try{
        let newUser = {};
        if(!req.body.name) newUser.name = " "; else newUser.name = req.body.name;
        if(req.file) newUser.profilePath = req.headers.host+"/"+req.file.path.split("/")[1];
        if(req.body.email) newUser.email = req.body.email; else newUser.phone = req.body.phone;
        if(!req.body.role) newUser.role = "User"; else newUser.role = req.body.role;

    bcrypt.hash(req.body.password,10).then(async hashedPassword => {
        newUser.password = hashedPassword;

        if(newUser.role=="Admin") await adminModel.create(newUser)
         else await userModel.create(newUser)
        newUser.password = req.body.password;
        const userSign = {
            password:newUser.password,
            role:newUser.role
        }
        if(req.body.email) userSign.email = req.body.email;
        else userSign.phone = req.body.phone;
    
        const token = jwt.sign(userSign,accessToken)
        res.json({status:"signup success",token:token})
    })
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default signup;