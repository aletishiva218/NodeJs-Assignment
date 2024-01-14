import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";
dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const deleteMiddleware = {
    token:(req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token) return res.status(400).json({error:"token not provided"})
        next()
    },
    validToken:(req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        jwt.verify(token,accessToken,(err,usercredintials)=>{
            if(err) return res.status(400).json({error:err})
            next();
        })
    },
    exists: (req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        jwt.verify(token,accessToken,async (err,usercredintials)=>{
            if(err) return res.status(400).json({error:err})
             let userExists;
            let usercredintialsNew = {};
            if(usercredintials.email) usercredintialsNew.email = usercredintials.email;
            else usercredintialsNew.phone = usercredintials.phone;
    
                if(usercredintials.role=="User") userExists = await userModel.findOne(usercredintialsNew)
                else userExists = await adminModel.findOne(usercredintialsNew)
                if(!userExists) return res.status(400).json({message:"unable to delete data",error:"user not exists"})
    next();
        })
    }
}

export default deleteMiddleware;