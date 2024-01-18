import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
import adminModel from "../../../Database/Models/adminModel.js";
dotenv.config()

const accessToken = process.env.ACCESS_TOKEN;

const deleteUsersMiddleware = {
    token:(req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token) return res.status(400).json({status:"failed",error:"Token not provided"})
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
    role:(req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        jwt.verify(token,accessToken,(err,usercredintials)=>{
            if(usercredintials.role!="Admin") return res.status(400).json({status:"failed",message:"You do not have permission to access this resource. Only administrators are authorized to fetch user data."})
            next();
        })
    },
    exists: (req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        jwt.verify(token,accessToken,async (err,usercredintials)=>{
            if(err) return res.status(400).json({error:err})

            let usercredintialsNew = {};
            if(usercredintials.email) usercredintialsNew.email = usercredintials.email;
            else usercredintialsNew.phone = usercredintials.phone;
           let userExists = await adminModel.findOne(usercredintialsNew)

            if(!userExists) return res.status(404).json({status:"failed",message:"Admin not found. Please check your credentials and try again."})
    next();
        })
    }

}

export default deleteUsersMiddleware;

//userrole is admin
//user exists