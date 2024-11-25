const error_function = require('./response-handler').error_function;
const jwt = require("jsonwebtoken");
const users = require("../db/models/users");
const dotenv = require("dotenv");
dotenv.config();

exports.checkLogin = (req, res, next) =>{
    try{
        const  authHeader = req.headers['authorization'];
        console.log("authHeader :",authHeader);
    
        let token = authHeader.split(' ')[1]
        console.log("token :",token);
    
        if(token == "" || token == null || token == undefined || token == "null" || token || "undefined"){
          
            let response = error_function({
                statusCode : 400,
                message : "invalid access token"
            })
            res.status(response.statusCode).send(response);
            return;
        }
        else{
            jwt.verify(token, process.env.PRIVATE_KEY, async (err, decoded)=>{
                if(err){
    
                    let response = error_function({
                        statusCode : 400,
                        message : err.message ? err.message : "something went wrong"
                    })
                    res.status(response.statusCode).send(response);
                    return;
    
                }
                else{
                    console.log("decoded :",decoded) 
                        let user_id = decoded.user_id;
                        console.log("user_id :",user_id);
    
                        let user = await users.findOne({_id : user_id});
                        console.log("user :",user);
    
                        if(user){
                            next();
                        }
                        else{
                            let response = error_function({
                                statusCode : 400,
                                message : error.message ? error.message : "user not found"
                            })
                            res.status(response.statusCode).send(response);
                            return;
                        }
                    
                }
            })
        }
        
     
    }
    catch(error){
        console.log("error :",error);
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "something went wrong"
        })
        res.status(response.statusCode).send(response);
        return;

    }
    }
