import userModel from "../../../Database/Models/userModel.js";

const viewUsers = async (req,res) => {
    try{
            let allUsers = await userModel.find({})
            res.json({status:"Ok",users:allUsers})
    }catch{(error)=>{
        res.status(400).json({error:error})
    }}
}

export default viewUsers;