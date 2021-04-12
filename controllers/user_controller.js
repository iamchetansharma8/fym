const user  = require('../config/mongoose');
const User=require('../models/user');
const ResetPassToken=require('../models/resetPassToken');
const fs=require('fs');
const path=require('path');
const signUpMailer=require('../mailers/sign-up');
const forgotPassMailer=require('../mailers/forgot-pass');
const crypto=require('crypto');

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

// rendering reset password page
module.exports.resetPasswordPage=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/users/profile/');
        }
        console.log('readme',req.params.token);
        let cur_user_token=await ResetPassToken.findOne({
            accessToken:req.params.token
        });
        if(!cur_user_token){
            console.log('error', 'Password reset token is invalid');
            return res.render('/');
        }
        cur_user_token = await cur_user_token.populate('user', 'name email').execPopulate();
        res.render('reset_pass',{
            title:"fyn | Reset Password",
            user_of_token:cur_user_token.user,
            token:req.params.token
        });
    }catch(err){
        console.log('Error in displaying reset password page',err);
        res.redirect('/');
    }
}

// performing the final reset action 
module.exports.finalReset=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/users/profile/');
        }
        let cur_user_token=await ResetPassToken.findOne({
            accessToken:req.params.token
        });
        if(!cur_user_token){
            console.log('error', 'Password reset token is invalid');
            return res.render('/');
        }
        
        cur_user_token = await cur_user_token.populate('user', 'name email password').execPopulate();
        let cur_usr=cur_user_token.user;
        console.log(cur_usr);
        if(req.body.password!=req.body.confirm_password||cur_user_token.isValid==false){
            return res.render('back');
        }
        cur_usr.password=req.body.password;
        await cur_usr.save();
        cur_user_token.isValid=false;
        return res.redirect('/');
    }catch(err){
        console.log('Error in displaying reset password page',err);
        res.redirect('/');
    }
}

// rendering forgot password page
module.exports.forgotPass=function(req,res){
    // if user is already signed in no need to show forgot password page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/');
    }
    return res.render('forgot_password',{
        title:"fyn | Forgot Password"
    })
}

// reset password object creation and sending email
module.exports.reset_pass=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/users/profile/');
        }
        //lllllllllllllhere leftt
        let cur_user=await User.findOne({
            email:req.body.email
        });
        if(cur_user){
            let token=crypto.randomBytes(20).toString('hex')
            let resetPassToken=await ResetPassToken.create({
                user:cur_user,
                accessToken:token,
                isValid:true
            });
            resetPassToken = await resetPassToken.populate('user', 'name email').execPopulate();
            forgotPassMailer.forgotPass(token,cur_user);
            console.log('reset mail sent');
            return res.redirect('/');
        }
        return res.redirect('/');
    }catch(err){
        console.log('Error in resetting password',err);
        res.redirect('/');
    }
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
                console.log('11',user);
                signUpMailer.newSignUp(user);
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
