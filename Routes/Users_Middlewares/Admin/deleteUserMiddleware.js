import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
import adminModel from "../../../Database/Models/adminModel.js";
import userModel from "../../../Database/Models/userModel.js";
dotenv.config()

const accessToken = process.env.ACCESS_TOKEN;

const deleteUserMiddleware = {
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
    },
    emailOrPhone:(req,res,next)=>{
        if(!req.query.email && !req.query.phone) return res.status(400).json({status:"failed",message:"Search by email or phone number."})
        next()
    },
    userExists:async (req,res,next)=>{
        const usercredintials = {};
        if(req.query.phone) usercredintials.phone = req.query.phone;
        else usercredintials.email = req.query.email;
        const user = await userModel.findOne(usercredintials)
        if(!user) return res.status(404).json({status:"failed",message:"User not exists with these credintials"})
        next()
    }
}

export default deleteUserMiddleware;

//userrole is admin
//user exists
//data available to delete