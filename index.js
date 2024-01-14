import signup from "./Routes/Users_Routes/signup.js";
import login from "./Routes/Users_Routes/login.js";
import view from "./Routes/Users_Routes/view.js";
import update from "./Routes/Users_Routes/update.js";
import delet from "./Routes/Users_Routes/delete.js";
import viewUsers from "./Routes/Users_Routes/Admin/viewUsers.js";
import viewUser from "./Routes/Users_Routes/Admin/viewUser.js";
import deleteUsers from "./Routes/Users_Routes/Admin/deleteUsers.js";
import updateUser from "./Routes/Users_Routes/Admin/updateUser.js";
import deleteUser from "./Routes/Users_Routes/Admin/deleteUser.js";

import signupMiddleware from "./Routes/Users_Middlewares/signupMiddleware.js";
import loginMiddleware from "./Routes/Users_Middlewares/loginMiddleware.js";
import viewMiddleware from "./Routes/Users_Middlewares/viewMiddleware.js";

import updateMiddleware from "./Routes/Users_Middlewares/updateMiddleware.js";
import deleteMiddleware from "./Routes/Users_Middlewares/deleteMiddleware.js";
import viewUsersMiddleware from "./Routes/Users_Middlewares/Admin/viewUsersMiddleware.js";
import deleteUsersMiddleware from "./Routes/Users_Middlewares/Admin/deleteUsersMiddleware.js";
import viewUserMiddleware from "./Routes/Users_Middlewares/Admin/viewUserMiddleware.js";
import updateUserMiddleware from "./Routes/Users_Middlewares/Admin/updateUserMiddleware.js";
import deleteUserMiddleware from "./Routes/Users_Middlewares/Admin/deleteUserMiddleware.js";
import uploadAvatar from "./Utils/uploadAvatar.js";

import express from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post("/api/signup",uploadAvatar,signupMiddleware.emailOrPhone,signupMiddleware.details,signupMiddleware.exists,signup) //signup for 
app.post("/api/login",loginMiddleware.emailOrPhone,loginMiddleware.details,loginMiddleware.exists,loginMiddleware.passwordCheck,login) //getting token if user exists
app.get("/api",viewMiddleware.token,viewMiddleware.validToken,viewMiddleware.exists,view) //reading data if user exists
app.put("/api",updateMiddleware.token,updateMiddleware.validToken,updateMiddleware.exists,updateMiddleware.update,updateMiddleware.name,update) //updating data if user exists
app.delete("/api",deleteMiddleware.token,deleteMiddleware.validToken,deleteMiddleware.exists,delet) //deleting user if user exists

app.get("/api/admin/users",viewUsersMiddleware.token,viewUsersMiddleware.validToken,viewUsersMiddleware.role,viewUsersMiddleware.exists,viewUsers) //reading all users details if admin exists
app.delete("/api/admin/users",deleteUsersMiddleware.token,deleteUsersMiddleware.validToken,deleteUsersMiddleware.role,deleteUsersMiddleware.exists,deleteUsers)
app.put("/api/admin/user",updateUserMiddleware.token,updateUserMiddleware.validToken,updateUserMiddleware.role,updateUserMiddleware.exists,updateUserMiddleware.emailOrPhone,updateUserMiddleware.userExists,updateUserMiddleware.update,updateUserMiddleware.name,updateUser) //reading particular user if admin exists
app.get("/api/admin/user",viewUserMiddleware.token,viewUserMiddleware.validToken,viewUserMiddleware.role,viewUserMiddleware.exists,viewUserMiddleware.emailOrPhone,viewUserMiddleware.userExists,viewUser) //reading particular user if admin exists
app.delete("/api/admin/user",deleteUserMiddleware.token,deleteUserMiddleware.validToken,deleteUserMiddleware.role,deleteUserMiddleware.exists,deleteUserMiddleware.emailOrPhone,deleteUserMiddleware.userExists,deleteUser) //reading particular user if admin exists

app.listen(port,()=>{
    console.log(`Server is started at port ${port}`)
})