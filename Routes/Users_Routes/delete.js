import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const delet = async (req,res) => {
    try{
        const authHeader = req.headers["authorization"]
        const userToken = authHeader && authHeader.split(" ")[1];
        jwt.verify(userToken,accessToken,async (err,user)=>{
            const usercredintials = {};
            if(user.email) usercredintials.email = user.email;
            else usercredintials.phone = user.phone;
            
            if(user.role == "Admin") await adminModel.deleteOne(usercredintials)
            else await userModel.deleteOne(usercredintials)
            res.json({message:"deleted successfully"})
        })
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default delet;