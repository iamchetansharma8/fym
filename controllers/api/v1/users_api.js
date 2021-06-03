
const User=require('../../../models/user');

// npm install jsonwebtoken
// library used to create a json web token
const jwt=require('jsonwebtoken');




// sign in and create a session
module.exports.createSession=async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});
        if(!user || user.password!=req.body.password){
            return res.json(422,{
                message:'Invalid username or password'
            });
        }
        return res.json(200,{
            message:"Sign In successesfull, here is your token. Keep it safe",
            data:{
                // assigning token using jsonwebtoken library decrypting it with our key and
                // setting expire time as well
                token: jwt.sign(user.toJSON(),process.env.JWT_SECRET_KEY,{expiresIn : '10000000'})
            }
        });
    }catch(err){
        console.log('Error in creating session using jwt ',err);
        return res.json(500,{
            message:"Internal Server Error : JWT"
        });
    }
}