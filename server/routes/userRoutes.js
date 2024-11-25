const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const checkLogin = require("../utils/checkLogin").checkLogin;
const accessControl = require("../utils/access-control").accessControl;


function setaccessControl(access_types){
    return (req,res,next) =>{
        accessControl( access_types, req, res, next);
    }
}


router.post('/users',setaccessControl("1"),userController.createUser);
router.get('/users',setaccessControl("1,2"),userController.getAllUsers);
router.get('/users/:id',setaccessControl("1,2"), userController.getSingleUser);
router.put('/users',setaccessControl("1,2"),userController.updateUser);
router.delete('/users/:id',setaccessControl("1,2"),userController.deleteUser);
router.put('/user',setaccessControl("1,2"),userController.resetPassword);

module.exports = router;