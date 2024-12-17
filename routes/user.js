const express=require('express');
const {handleUserSignup,handleUserLogin}=require('../controllers/user');
const router=express.Router();

//sign-up
router.post('/',handleUserSignup);
router.post('/login',handleUserLogin);


module.exports=router;