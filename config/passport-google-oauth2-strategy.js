const passport=require('passport')
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
// crypto is used here to generate random passwords fo accounts created through google
const crypto=require('crypto');
const User=require('../models/user');
const signUpMailer=require('../mailers/sign-up');
const env=require('./environment');
// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID:env.google_client_id,
    clientSecret:env.google_client_secret,
    callbackURL:env.google_callback_url
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
                    password: crypto.randomBytes(20).toString('hex'),
                    verified: true
                },function(err,user){
                    if(err){
                        console.log("Error in creating user through google oauth",err);
                    }
                    signUpMailer.newSignUp(user);
                    return done(null,user);
                });
            }
        });
    }
));

module.exports=passport