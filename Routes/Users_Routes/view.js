import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const view = async (req,res) => {
    try{
        const authHeader = req.headers["authorization"]
        const userToken = authHeader && authHeader.split(" ")[1];
        jwt.verify(userToken,accessToken,async (err,user)=>{
            let userCredintials = {};
            if(user.email) userCredintials.email = user.email; else userCredintials.phone = user.phone;

            let getData;
            if(user.role == "Admin") getData = await adminModel.findOne(userCredintials)
            else getData = await userModel.findOne(userCredintials)

        let displayData = {
            name:getData.name,
            email:getData.email,
            phone:getData.phone,
            profilePath: getData.profilePath,
            password:user.password,
            role:user.role
        }
        
            res.json(displayData)
        })
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default view;