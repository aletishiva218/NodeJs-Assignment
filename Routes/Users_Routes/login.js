import adminModel from "../../Database/Models/adminModel.js";
import userModel from "../../Database/Models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const login = async (req,res) => {
    try{
        const usercredintials = {};
        if(req.body.email) usercredintials.email = req.body.email;
        else usercredintials.phone = req.body.phone;
        if(req.body.role) usercredintials.role = req.body.role;

        let userData;
        if(usercredintials.role=="Admin") {
            usercredintials.role = undefined;
            userData = await adminModel.findOne(usercredintials)
        }
        else {
            usercredintials.role=undefined;
            userData = await userModel.findOne(usercredintials)
        }

        if(!req.body.role) usercredintials.role = "User"; else usercredintials.role = req.body.role;

        const userSign = {
            email:userData.email,
            phone:userData.phone,
            password:req.body.password,
            role:usercredintials.role
        }

        const token = jwt.sign(userSign,accessToken)
        res.json({status:"login success",token:token})
        
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default login;