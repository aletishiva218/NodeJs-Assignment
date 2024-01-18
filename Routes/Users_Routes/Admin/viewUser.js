import userModel from "../../../Database/Models/userModel.js";

const viewUser = async (req,res) => {
    try{

            const userCredintials = {};
            if(req.query.email) userCredintials.email = req.query.email;
            if(req.query.phone) userCredintials.phone = req.query.phone;

            let user = await userModel.findOne(userCredintials)

            res.json({status:"Ok",user:user})
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default viewUser;