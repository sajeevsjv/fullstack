const users = require("../db/models/users");
const { success_function, error_function } = require("../utils/response-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const resetPassword = require("../utils/email-templates/resetPassword").resetPassword;
const sendEmail = require("../utils/send-email").sendEmail;


exports.login = async (req, res) => {
    try {
        let email = req.body.email;
        console.log("email :", email);

        let password = req.body.password;
        console.log("password:", password);

        //validations
        let user = await users.findOne({ email });
        console.log("user :", user);

        if (user) {
            let db_password = user.password;
            console.log("db_password :", db_password);

            let passwordMatch = bcrypt.compareSync(password, db_password);
            console.log("passwordMatch :", passwordMatch);

            let _id = user._id;
            console.log("userid :", _id);
            let user_type = user.user_type;
            console.log("user_type :", user_type);
            let is_password_reset = user.is_password_reset;


            if (passwordMatch) {
                let token = jwt.sign({ user_id: user.id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
                let data = {
                    token,
                    _id,
                    user_type,
                    is_password_reset
                }
                let response = success_function({
                    statusCode: 200,
                    data,
                    message: "Login succesful"
                });

                res.status(response.statusCode).send(response);
                return;
            }
            else {
                let response = error_function({
                    statusCode: 400,
                    message: "Invalid password"
                });

                res.status(res.statusCode).send(response);
            }
        }

        else {
            let response = error_function({
                statusCode: 400,
                message: "user not found"

            });

            res.status(response.statusCode).send(response);
        }
    }
    catch (error) {
        console.log("error:", error);

        let response = error_function({
            statusCode: 400,
            message: error.message ? error.message : "something went wrong"
        })
        res.status(response.statusCode).send(response);
    }
}

exports.forgotPassword = async (req, res) => {
    let email = req.body.email;

    let user = await users.findOne({ email });
    console.log("user :", user);

    if (user) {
        let reset_token = jwt.sign(
            { user_id: user.id },
            process.env.PRIVATE_KEY,
            { expiresIn: "10m" }
        );

        let data = await users.updateOne({ email }, { $set: { password_token: reset_token } });
        if (data.matchedCount === 1 && data.modifiedCount == 1) {
            let reset_link = `${process.env.FRONTEND_URL}/forgotPassword.html?token=${reset_token}`;
            let email_template = await resetPassword(user.name, reset_link);
            sendEmail(email, "Forgot password", email_template);
            let response = success_function({
                statusCode: 200,
                message: "Email sent successfully",
            });
            res.status(response.statusCode).send(response);
            return;
        }
    }
    else {
        let response = error_function({
            statusCode: 400,
            message: "user not found"
        })
        res.status(response.statusCode).send(response);
    }

}

exports.resetPassword = async (req, res) => {
    try {

        let password = req.body.password;
        let confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {

            const authHeader = req.headers["authorization"];
            const token = authHeader.split(" ")[1];

            let decoded = jwt.decode(token);

            let user = await users.findOne({ $and: [{ _id: decoded.user_id }, { password_token: token }] });
            if (user) {
                let salt = await bcrypt.genSalt(10);
                let hashed_password = bcrypt.hashSync(password, salt);

                let data = await users.updateOne({ _id: decoded.user_id }, { $set: {password : hashed_password, password_token: null } });

                if (data.matchedCount === 1 && data.modifiedCount === 1) {
                    let response = success_function({
                        statusCode: 200,
                        message: "Password changed succesfully"
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }
                else if (data.matchedCount === 0) {
                    let response = error_function({
                        statusCode: 400,
                        message: "User not found"
                    });

                    res.status(response.statusCode).send(response);
                    return;
                }
                else {
                    let response = error_function({
                        statusCode: 400,
                        message: "Password reset failed"
                    });

                    res.status(response.statusCode).send(response);
                    return;
                }
            }
            else {
                let response = error_function({
                    statusCode: 400,
                    message: "Forbidden"
                });

                res.status(response.statusCode).send(response);
                return;
            }

        }
        else{
            let response = error_function({
                statusCode: 400,
                message: "Passwords doesnt match"
            });

            res.status(response.statusCode).send(response);
            return;
        }

    }
    catch (error) {
        let response = error_function({
            statusCode: 400,
            message: error
                ? error.message
                    ? error.message
                    : error
                : "Something went wrong",
        });

        res.status(response.statusCode).send(response);
        return;
    }

}


