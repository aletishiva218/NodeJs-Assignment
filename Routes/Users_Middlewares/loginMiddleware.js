import bcrypt from "bcrypt";
import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";
import Joi from "joi";
const loginMiddleware = {
    emailOrPhone:(req,res,next)=>{
        if(!req.body.email && !req.body.phone) return res.status(400).json({status:"failed",message:"Phone number or email is required"})
        next()
    },
    details:(req,res,next)=>{
        const schema = Joi.object({
            email:Joi.string().email(),
            phone:Joi.number().min(1000000000).max(9999999999),
            role:Joi.string().valid("User","Admin"),
            password:Joi.string()
        }).unknown(true)
        const {error} = schema.validate(req.body,{abortEarly:false})
        if(error){
            const errors = error.details;
            const displayErrors = [];
            for(let err of errors){
                const errorPath = err.path[0];
                if(errorPath == "email") displayErrors.push("invalid email format")
                if(errorPath == "phone") displayErrors.push("invalid phone number")
                if(errorPath == "role") displayErrors.push("role must be 'Admin' or 'User'")
            }
            return res.status(422).json({status:"error",error:displayErrors})
        }
        next();
    },
    exists:async (req,res,next)=>{
        const userCredintials = {};
        if(req.body.email) userCredintials.email = req.body.email; else userCredintials.phone = req.body.phone;
        
        let userExists;
        if(!req.body.role || req.body.role=="User") 
        userExists = await userModel.findOne(userCredintials);
        else userExists = await adminModel.findOne(userCredintials);


        if(!userExists) return res.status(404).json({status:"failed",message:"User not found. Please check your credintials and try again."})
        
            next();
    },
    passwordCheck:async (req,res,next)=>{
        if(!req.body.password) return res.status(400).json({status:"failed",message:"Password is required. Please provide a valid password"})
        
        const userCredintials = {};
        if(req.body.email) userCredintials.email = req.body.email; else userCredintials.phone = req.body.phone;
        
        let userExists;
        if(!req.body.role || req.body.role=="User") 
        userExists = await userModel.findOne(userCredintials);
         else userExists = await adminModel.findOne(userCredintials)

        bcrypt.compare(req.body.password,userExists.password,(error,result)=>{
            if(error) return res.status(400).json({error:error})

            if(!result) return res.status(401).json({status:"failed",message:"Incorrect password. Please verify your password and try again."})
            next();
        })
    }
}

export default loginMiddleware;