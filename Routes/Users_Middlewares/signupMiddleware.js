import Joi from "joi";
import userModel from "../../Database/Models/userModel.js";
import adminModel from "../../Database/Models/adminModel.js";

const signupMiddleware = {
    emailOrPhone:(req,res,next)=>{
        if(!req.body.email && !req.body.phone) return res.status(400).json({status:"failed",message:"Phone number or email is required"})
        next()
    },
    details: (req,res,next)=>{
            const schema = Joi.object({
                name:Joi.string().min(2).max(100),
                email:Joi.string().email(),
                phone:Joi.number().min(1000000000).max(9999999999),
                password:Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)),
                role:Joi.string().valid("User","Admin")
            }).unknown(true)
            const {error} = schema.validate(req.body,{abortEarly:false})
            if(error){
                const errors = error.details;
                const displayErrors = [];
                for(let err of errors){
                    const errorPath = err.path[0];
                    if(errorPath == "name") displayErrors.push("name must be string,minimum 2 and maximum 100 characters")
                    if(errorPath == "email") displayErrors.push("invalid email format")
                    if(errorPath == "phone") displayErrors.push("invalid phone number")
                    if(errorPath == "password") displayErrors.push("password is required, must be string  and should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
                    if(errorPath == "role") displayErrors.push("role must be 'Admin' or 'User'")
                }
                return res.status(422).json({status:"failed",error:displayErrors})
            }
            next()
    },
    exists:async (req,res,next)=>{
        const userCredintials = {};
        let userExists;
        if(req.body.email) userCredintials.email = req.body.email;
        else userCredintials.phone = req.body.phone;
    
        if(!req.body.role || req.body.role=="User")
        userExists = await userModel.findOne(userCredintials); 
        else userExists = await adminModel.findOne(userCredintials);
        
        if(userExists) return res.status(400).json({status:"failed",message:"User with this credintials already exists"})
        next()
    }
}

export default signupMiddleware;