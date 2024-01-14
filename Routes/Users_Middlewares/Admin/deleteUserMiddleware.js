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
    role:(req,res,next)=>{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        jwt.verify(token,accessToken,(err,usercredintials)=>{
            if(usercredintials.role!="Admin") return res.status(400).json({message:"access denied",error:"you are not admin"})
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

            if(!userExists) return res.status(400).json({message:"access denied",error:"you are not admin"})
    next();
        })
    },
    emailOrPhone:(req,res,next)=>{
        if(!req.query.email && !req.query.phone) return res.status(400).json({message:"delete by phone number or email",error:"unable to delete data"})
        next()
    },
    userExists:async (req,res,next)=>{
        const usercredintials = {};
        if(req.query.phone) usercredintials.phone = req.query.phone;
        else usercredintials.email = req.query.email;
        const user = await userModel.findOne(usercredintials)
        if(!user) return res.status(400).json({message:"user not found"})
        next()
    }
}

export default deleteUserMiddleware;

//userrole is admin
//user exists
//data available to delete