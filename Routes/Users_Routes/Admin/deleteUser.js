import userModel from "../../../Database/Models/userModel.js";

const deleteUser = async (req,res) => {
    try{
            const userCredintials = {};
            if(req.query.email) userCredintials.email = req.query.email;
           else userCredintials.phone = req.query.phone;

            await userModel.deleteOne(userCredintials)

            res.json({status:"Ok",message:"deleted successfully"})
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default deleteUser;