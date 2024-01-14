import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Joi from "joi";
import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";
dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const updateMiddleware = {
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
                if(!userExists) return res.status(400).json({message:"unable to fetch data",error:"user not exists"})
    next();
        })
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

export default updateMiddleware;

//if body name or file then updated else not updated