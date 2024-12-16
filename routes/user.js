const express=require('express');
const {handleUserSignup}=require('../controllers/user');
const router=express.Router();

//sign-up
router.post('/',handleUserSignup);


module.exports=router;