const users = require('../db/models/users');
const {success_function , error_function } = require('../utils/response-handler');
const bcrypt = require('bcrypt');
const fileUpload = require('../utils/file-upload').fileUpload;
const user_types = require ("../db/models/user_types");
const set_password_template = require("../utils/email-templates/set-password").resetPassword;
const sendEmail = require("../utils/send-email").sendEmail;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const resetPassword = require("../utils/email-templates/resetPassword").resetPassword;



exports.createUser = async function (req, res) {
    try {

        let body = req.body;
        console.log("body : ", body);


        let name = req.body.name;
        console.log("name : ", name);

        let emails = req.body.email;
        console.log("email : ", emails);

        let age  = req.body.age;
        console.log("age : ", age);

        let image = req.body.image

       
        body.user_type = "66f420a7384f7819814abf1a";

        let count = await users.countDocuments({email : emails});
        console.log("count : ", count);

        if(count > 0){
            let response = error_function({
                statusCode : 400,
                message : "user already exists"
            })
            res.status(response.statusCode).send(response);
            return;
        }
        

        if(image){
        let image = req.body.image;
        //image validation
        let regExp = /^data:/;
        let result = regExp.test(image);
        

        if(result){
            let img_path = await fileUpload (image,"users");
            console.log("img_path :",img_path);
            body.image = img_path;
        }
        else{
            let response = error_function({
                statusCode : 400,
                message : 'Invalid profile url'
            });
            res.status(response.statusCode).send(response);
            return;

        }
    }




        //validations required
        if(!name) {
            let response = error_function({
                statusCode : 400,
                message : 'Name is required'
            });
            res.status(response.statusCode).send(response);
            return;
        }

        

          //Generating random password for new user
          function generateRandomPassword(length) {
            let charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
            let password = "";
  
            for (var i = 0; i < length; i++) {
              var randomIndex = Math.floor(Math.random() * charset.length);
              password += charset.charAt(randomIndex);
            }
  
            return password;
          }
  
          var randomPassword = generateRandomPassword(12);
          //console.log(randomPassword);

        let content = await set_password_template (name,emails,randomPassword);
        await sendEmail(emails,"updated password",content)
          
        
          body.password = randomPassword;
          let password = body.password;
        //password hashing

        let salt = bcrypt.genSaltSync(10);
        console.log("salt :",salt);

        let hashed_password = bcrypt.hashSync(password, salt);  
        console.log("hashed_password :",hashed_password);

        body.password = hashed_password;
    
        let new_user = await  users.create(body);
    
        if(new_user) {

            response = success_function({
                statusCode : 200,
                message : "user created succesfully"
            })
            res.status(response.statusCode).send(response.message);
            return;
        }else {
            res.status(400).send("User creation failed");
            return;
        }
        
    } catch (error) {
        console.log("error : ", error);
        res.status(400).send(error.message ? error.message : "Something went wrong");
        return;
    }
}

exports.getAllUsers = async function(req, res) {
    try {
        let usersData = await users.find({ name: { $ne: "admin" } }).populate({ path: "user_type", select: "-__v" }).select("-__v");
        console.log("usersData : ", usersData);
    
        res.status(200).send(usersData);
        return;
    } catch (error) {
        console.log("error : ", error);
        res.status(400).send(error.message ? error.message : error);
    }
}

exports.getSingleUser = async function(req, res) {
    try {
        let id = req.params.id;
        console.log("id : ", id);
    
        let userData = await users.findOne({_id : id});
        console.log("userData : ", userData);
    
        res.status(200).send(userData);
        return;
    } catch (error) {
        console.log("error : ", error);
        res.status(400).send(error.message ? error.message : error);
    }
}

exports.deleteUser = async (req,res) =>{
    try{
        let id = req.params.id;
        let deleteuser = await users.deleteOne({_id : id});
        if(deleteuser){
            let response = success_function({
                statusCode : 200,
                message : "user deleted succesfully"

            });
            res.status(response.statusCode).send(response.message);
        }
        else{
            let response = error_function({
                statusCode : 400,
                message : "failed to delete"
            })
            res.status(response.statusCode).send(response.statusCode);

        }
    }
    catch(error){
        console.log("error :",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        })
        res.status(response.statusCode).send(response.statusCode);

    }
}

exports.updateUser = async (req,res) =>{
    try{
        let data = req.body;
        console.log("data:",data);
    
        let id = data.id;
        let _id =  new mongoose.Types.ObjectId(id);
        console.log(_id);

        delete data.id;

        console.log("new data:",data);
    
        updateUser = await users.updateOne({_id},{$set : data});
        if(updateUser){
            res.status(200).send("user updated successfully")
        }
        else{
            res.status(400).send("user update failed")
        }
        
    
    }
    catch(error){
        console.log(error.message ? error.message : "something went wrong");
        res.status(400).send(error.message ? error.message : "something went wrong")
    }
   
}

exports.resetPassword = async (req,res) =>{
    let current_password = req.body.current_password;
    let new_password = req.body.new_password;

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(" ")[1];

    if(current_password === new_password){
        let response = error_function({
            statusCode : 400,
            message : "try another password"
        })
      res.status(response.statusCode).send(response);
      return;
    }
    

    let decode = jwt.decode(token);

    let user = await users.findOne({_id:decode.user_id})

    let db_password = user.password;

    // check dbpassword and current_password is same
    let passwordMatch = bcrypt.compareSync(current_password,db_password);
    if(!passwordMatch){
        let response = error_function({
            statusCode : 400,
            message : "Current password is not valid"
        })
        res.status(response.statusCode).send(response);
    return;
    }
    else{
        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(new_password,salt);

        let setnew_password = await users.updateOne({_id:decode.user_id},{ $set : {password : hashed_password, is_password_reset : true}});

        if(setnew_password){
            let response = success_function({
                statusCode : 200,
                data : decode.user_id,
                message : "Password reseted succesfully"
            })
            res.status(response.statusCode).send(response);
            return;
            
            
        }
        else{
            let response = error_function({
                statusCode : 400,
                message : "Failed to reset password"
            })
            res.status(response.statusCode).send(response);
            return;
        }
    }

}

