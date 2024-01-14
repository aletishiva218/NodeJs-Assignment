import mongoose from "../config.js";
const Schema = new mongoose.Schema({
    name:String,
    profilePath:String,
    email:String,
    phone:String,
    password:String
});

const userModel = new mongoose.model("user",Schema);

export default userModel;