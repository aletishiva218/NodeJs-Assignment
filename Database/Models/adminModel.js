import mongoose from "../config.js";
const Schema = new mongoose.Schema({
    name:String,
    profilePath:String,
    email:String,
    phone:String,
    password:String
});

const adminModel = new mongoose.model("admin",Schema);

export default adminModel;