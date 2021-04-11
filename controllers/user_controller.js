const user  = require('../config/mongoose');
const User=require('../models/user');
const fs=require('fs');
const path=require('path');

// rendering user profile page
module.exports.profile=function(req,res){
    return res.render('user_profile',{
        title:"Users's profile"
    });
}

// rendering sign up page
module.exports.signUp=function(req,res){
    // if user is already signed in no need to show signup page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/');
    }
    return res.render('user_sign_up',{
        title:"fyn | Sign Up"
    })
}

// rendering sign in page
module.exports.signIn=function(req,res){
    // if user is already signed in no need to show signIn page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/');
    }
    return res.render('user_sign_in',{
        title:"fyn | Sign In"
    })
}

// creating user sign up
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in sign up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('Error in creating user during sign up');
                    return;
                }
                // here we're returning to sign_in in next line when everything is correct
                // but we need to verify whether email entered by user is correct or not
                // for that we in future need to send an email with a link or otp to
                // provided email and redirect to some page according to that
                return res.redirect('/users/sign_in');
            })
        }
        else{
            return res.redirect('back');
        }
    });
}

// sign in and create a session
module.exports.createSession=function(req,res){
    return res.redirect('/');
}
// sign out and destroy session
module.exports.destroySession=function(req,res){
    // logout function is given to req by passport.js
    req.logout();
    return res.redirect('/');
}
