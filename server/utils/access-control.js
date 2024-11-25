const users = require("../db/models/users");
const control_data = require("./control_data.json"); // Contains role mappings like { "1": "admin", "2": "employee" }
const jwt = require("jsonwebtoken");
const { success_function, error_function } = require("./response-handler");
const dotenv = require("dotenv");
dotenv.config(); // Loads environment variables from .env file, including the PRIVATE_KEY

exports.accessControl = async function (access_types, req, res, next) {
    try {
        console.log("access_types :", access_types);

        // If access_types is "*", allow everyone
        if (access_types === "*") {
            return next();
        }

        // Get the Authorization header
        const authHeader = req.headers['authorization'];
        console.log("authHeader :", authHeader);
        
        // If no token is found, return an error asking the user to login
        if (!authHeader) {
            let response = error_function({
                statusCode: 400,
                message: "Please login to continue"
            });
            return res.status(response.statusCode).send(response);
        }

        // Split the token from "Bearer <token>"
        const token = authHeader.split(" ")[1];
        console.log("token :", token);

        // Handle invalid or missing token
        if (!token || token === "null" || token === "undefined") {
            let response = error_function({
                statusCode: 400,
                message: "Invalid access token"
            });
            return res.status(response.statusCode).send(response);
        }

        // Verify the JWT token using the private key from the environment
        jwt.verify(token, process.env.PRIVATE_KEY, async function (err, decoded) {
            if (err) {
                let response = error_function({
                    statusCode: 400,
                    message: "Authentication failed"
                });
                return res.status(response.statusCode).send(response);
            }

            console.log("decoded :", decoded);

            // Find the user based on decoded user_id
            let user = await users.findOne({ _id: decoded.user_id }).populate("user_type");
            console.log("user :", user);

            if (!user) {
                let response = error_function({
                    statusCode: 404,
                    message: "User not found"
                });
                return res.status(response.statusCode).send(response);
            }

            if (!user.user_type) {
                let response = error_function({
                    statusCode: 400,
                    message: "User type not defined"
                });
                return res.status(response.statusCode).send(response);
            }

            // Get the user's type
            let user_type = user.user_type.user_type;
            console.log("user_type :", user_type);

            // Get the allowed roles from access_types and map them to roles defined in control_data
            let allowed = access_types.split(",").map((obj) => control_data[obj]);
            console.log("allowed :", allowed);

            // If the user's role is allowed, proceed to the next middleware
            if (allowed && allowed.includes(user_type)) {
                return next();
            } else {
                let response = error_function({
                    statusCode: 403,
                    message: "Not allowed to access the route"
                });
                return res.status(response.statusCode).send(response);
            }
        });
    } catch (error) {
        console.log("error :", error);
        let response = error_function({
            statusCode: 400,
            message: error.message ? error.message : "Something went wrong"
        });
        res.status(response.statusCode).send(response);
    }
};
