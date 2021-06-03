const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtraxtJWT=require('passport-jwt').ExtractJwt;

// importing user as we have to find one to authenticate
const User=require('../models/user');

// defining some options
let opts={
    jwtFromRequest:ExtraxtJWT.fromAuthHeaderAsBearerToken(),
    // secret key : used to encrypt and decrypt
    secretOrKey:process.env.JWT_SECRET_KEY
}
passport.use(new JWTStrategy(opts,function(jwt_payload,done){
    // finding user by id, note that user's info is in jwt_payload
    User.findById(jwt_payload._id,function(err,user){
        if(err){
            console.log('Error in finding user from JWT ',err);
            return;
        }
        if(user){
            // user found done(no_error,user_itself)
            return done(null,user); 
        }
        else{
            // user not found done(no_error,false_user_not_found)
            return done(null,false);
        }
    })
}));

module.exports=passport;

// In Authentication, user sends some info to server, server verifies user id and password
// with db, if it's found correct, it generates a token that is stored in browser cookies
// but as here in api's we don't have cookies, we need to work on something else to store it
// So we need to store authentication token somewhere else
// One way :
// Everytime a front end device makes an request we send this auth token in params or header
// and server verifies token with db (obviously we need to store token and info like it's 
// expiry in db)
// Second Way : using JWT as we're doing above
// we don't need to store anything in db
// as here token (Json Web Token) generated will have 3 components
// 1. Header(contains algo used to encrypt this token), 2. Payload(actual info like user_id,
//  user_email, maybe user password and also info about expiry of token), 3. Signature
// This token will be send to front end framework, it's stored on device's local storage
// With every request front-end will send this token to server, server decrypts it then  
// knows from payload about it's validity
// decyption :
// 1st whole token will be decrypted then Payload is decrypted using header
