const bcrypt=require('bcrypt');
const saltRounds = parseInt(process.env.saltRounds); 
//higher salt rounds means more secure, but slower
const { v4: uuidv4 } = require("uuid");
const {setUser}=require('../service/auth');
const User=require('../models/user');

async function handleUserSignup(req,res){
    const { name,email,password }=req.body;
    try {
        const hashedPassword=await bcrypt.hash(password,saltRounds);

        await User.create({
            name,
            email,
            password:hashedPassword
        });
        return res.redirect('/');
    } catch (error) {
        console.log("Error during signup:",error);
        return res.status(500).send("Something went wrong. Please try again later.");
    }
}

async function handleUserLogin (req,res){
    try {

    const {email,password}=req.body;

    const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                error: "Invalid Username or Password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', {
                error: "Invalid Username or Password"
            });
        }

    const sessionId=uuidv4();
    setUser(sessionId,user);
    res.cookie('uid',sessionId);
    return res.redirect('/');
        
    } catch (error) {
        console.log("Error during login:",error);
        return res.status(500).send("Something went wrong. Please try again later.");
    }
}

module.exports={
    handleUserSignup,
    handleUserLogin
};