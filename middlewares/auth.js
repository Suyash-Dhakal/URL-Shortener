const {getUser}=require('../service/auth');
const User=require('../models/user');

async function restrictToLoggedinUserOnly (req,res,next){
    const userUid=req.cookies?.uid;

    if(!userUid){
        return res.redirect('/login');
    }
    const user=getUser(userUid);
    if(!user) return res.redirect('/login');

    const dbUser=await User.findById(user._id);
    if(!dbUser) {
        return res.redirect('/login'); //in the case where user is not found in the db
    }

    req.user=user;
    next();
}

async function checkAuth(req,res,next){
    const userUid=req.cookies?.uid;
    const user=getUser(userUid);
    
    if (!user) {
        req.user = null; // Indicate that the user is not authenticated
        next();
      } else {
        // **Additional validation step:**
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
          req.user = null; // User not found in the database
          next();
        } else {
          req.user = dbUser;
          next();
        }
      }
}

module.exports={
    restrictToLoggedinUserOnly,
    checkAuth,
}