import userModel from "../../../Database/Models/userModel.js";

const updateUser = async (req,res) => {
    try{
            const userCredintials = {};
            if(req.query.email) userCredintials.email = req.query.email;
            else userCredintials.phone = req.query.phone;
            
            const updateData = {};
            
            if(req.body.name) updateData.name = req.body.name;
            if(req.file) updateData.profilePath = req.headers.host+"/"+req.file.path.split("\\")[1];

            await userModel.updateOne(userCredintials,{$set:updateData})
            
            res.json({message:"updated successfully"})
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default updateUser;