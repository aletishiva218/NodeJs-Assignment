import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const update = async (req,res) => {
    try{
        const authHeader = req.headers["authorization"]
        const userToken = authHeader && authHeader.split(" ")[1];
        
        jwt.verify(userToken,accessToken,async (err,user)=>{
            let userCredintials = {};
            if(user.email) userCredintials.email = user.email; else userCredintials.phone = user.phone;
            
            const newData = {}
            if(req.body.name) newData.name = req.body.name;
            if(req.file) newData.profilePath = req.headers.host+"/"+req.file.path.split("\\")[1];

            if(user.role == "Admin") await adminModel.updateOne(userCredintials,{$set:newData});      
            else await userModel.updateOne(userCredintials,{$set:newData})
            res.json({message:"updated successfully"})
        })
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default update;