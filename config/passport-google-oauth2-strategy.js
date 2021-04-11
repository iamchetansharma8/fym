const passport=require('passport')
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;

// crypto is used here to generate random passwords fo accounts created through google
const crypto=require('crypto');
const User=require('../models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:"907252034973-v9kgiii68329f1jjjjt8eso7ovtl0u8v.apps.googleusercontent.com",
    clientSecret:"w0lpunxwStXj4Fvy598y08nQ",
    callbackURL:"http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        // find a user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("Error in google passport strategy",err);
                return;
            }
            console.log(profile);
            if(user){
                // if found, set this user as req.user
                return done(null,user);
            }
            else{
                // if not found, create new user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){
                        console.log("Error in creating user through google oauth",err);
                    }
                    return done(null,user);
                });
            }
        });
    }
));

module.exports=passport