import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
}).catch((error)=>{
    console.log("Error while connecting to database: ",error)
})

export default mongoose;