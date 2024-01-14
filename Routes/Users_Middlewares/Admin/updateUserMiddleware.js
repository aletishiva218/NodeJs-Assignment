import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
import adminModel from "../../../Database/Models/adminModel.js";
import userModel from "../../../Database/Models/userModel.js";
import Joi from "joi";
dotenv.config()

const accessToken = process.env.ACCESS_TOKEN;

const updateUserMiddleware = {
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
        if(!req.query.email && !req.query.phone) return res.status(400).json({message:"update by search phone number or email",error:"unable to update data"})
        next()
    },
    userExists:async (req,res,next)=>{
        const usercredintials = {};
        if(req.query.phone) usercredintials.phone = req.query.phone;
        else usercredintials.email = req.query.email;
        const user = await userModel.findOne(usercredintials)
        if(!user) return res.status(400).json({message:"user not found"})
        next()
    },
    update:(req,res,next)=>{
        if(!req.body.name && !req.file) return res.status(400).json({message:"failed to update data",error:"name,profile image not provided"})
        next()
    },
    name:(req,res,next)=>{
        const schema = Joi.object({
            name:Joi.string().min(2).max(100)
        }).unknown(true)
        const {error} = schema.validate(req.body,{abortEarly:false})
        if(error){
            const errors = error.details;
            const displayErrors = [];
            for(let err of errors){
                const errorPath = err.path[0];
                if(errorPath == "name") displayErrors.push("name must be string,minimum 2 and maximum 100 characters")
            }
            return res.status(400).json({error:displayErrors})
        }
        next();
    }
}

export default updateUserMiddleware;

//userrole is admin
//user exists
//data available to delete