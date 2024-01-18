import userModel from "../../../Database/Models/userModel.js";

const deleteAllUsers = async (req,res) => {
    try{

            await userModel.deleteMany({})

            res.json({status:"Ok",message:"deleted successfully"})
            
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default deleteAllUsers;