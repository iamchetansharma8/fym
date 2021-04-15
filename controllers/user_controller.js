const user  = require('../config/mongoose');
const User=require('../models/user');
const ResetPassToken=require('../models/resetPassToken');
const EnableAccessToken=require('../models/enableAccToken');
const fs=require('fs');
const path=require('path');
const signUpMailer=require('../mailers/sign-up');
const verifyMailer=require('../mailers/verify_acc');
const forgotPassMailer=require('../mailers/forgot-pass');
const crypto=require('crypto');
const { verifyAccount } = require('../mailers/verify_acc');

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
        // console.log('readme',req.params.token);
        let cur_user_token=await ResetPassToken.findOne({
            accessToken:req.params.token
        });
        if(!cur_user_token||cur_user_token.isValid==false){
            req.flash('warning','This link to reset password is invalid or is expired');
            console.log('error', 'Reset Password token is invalid');
            return res.redirect('/');
        }
        cur_user_token = await cur_user_token.populate('user', 'name email verified').execPopulate();
        res.render('reset_pass',{
            title:"fyn | Reset Password",
            user_of_token:cur_user_token.user,
            token:req.params.token
        });
    }catch(err){
        console.log('Error in displaying verify email id page',err);
        res.redirect('/');
    }
}

// rendering verify email page
module.exports.verifyEmailPage=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/users/profile/');
        }
        // console.log('readme',req.params.token);
        let cur_user_token=await EnableAccessToken.findOne({
            accessToken:req.params.token
        });
        if(!cur_user_token){
            console.log('error', 'Verify email token is invalid');
            req.flash('error','Verify email token is invalid');
            return res.redirect('/');
        }
        cur_user_token = await cur_user_token.populate('user', 'name email verified').execPopulate();
        res.render('verify_email_page',{
            title:"fyn | Verify Account",
            user_of_token:cur_user_token.user,
            token:req.params.token
        });
    }catch(err){
        console.log('Error in displaying reset password page',err);
        return res.redirect('/');
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
            req.flash('error','Password and Confirm password fields mismatched');
            return res.redirect('back');
        }
        cur_usr.password=req.body.password;
        await cur_usr.save();
        cur_user_token.isValid=false;
        cur_user_token.save();
        req.flash('success','Password changed successfully!!');
        return res.redirect('/');
    }catch(err){
        console.log('Error in displaying reset password page',err);
        res.redirect('/');
    }
}

// performing the final verification action 
module.exports.finalVerification=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/users/profile/');
        }
        let cur_user_token=await EnableAccessToken.findOne({
            accessToken:req.params.token
        });
        if(!cur_user_token){
            req.flash('error','Email Verification token is invalid');
            console.log('error', 'Email Verification token is invalid');
            return res.render('/');
        }
        cur_user_token = await cur_user_token.populate('user', 'name email verified').execPopulate();
        let cur_usr=cur_user_token.user;
        cur_usr.verified=true;
        await cur_usr.save();
        cur_user_token.isValid=false;
        req.flash('success','Email Verification completed successfully, login to continue');
        return res.redirect('/users/sign_in');
    }catch(err){
        console.log('Error in verifying user email',err);
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
            req.flash('success','Check your email to reset password');
            console.log('reset mail sent');
            return res.redirect('/');
        }
        req.flash('warning','The email id you entered is not signed in with us');
        return res.redirect('/users/forgot_password');
    }catch(err){
        req.flash('error','Error in resetting password');
        console.log('Error in resetting password',err);
        res.redirect('/');
    }
}

// creating user sign up
module.exports.create=async function(req,res){
    try{
        if(req.body.password!=req.body.confirm_password){
            req.flash('warning','Password and Confirm Password fields mismatched');
            return res.redirect('back');
        }
        let user=await User.findOne({email:req.body.email});
        if(!user){
            user=await User.create(req.body);
            user.verified=false;
            signUpMailer.newSignUp(user);
            let token=crypto.randomBytes(20).toString('hex')
                let enableAccToken=await EnableAccessToken.create({
                     user:user,
                     accessToken:token,
                     isVerified:false
            });
            enableAccToken = await enableAccToken.populate('user', 'name email verified').execPopulate();
            verifyMailer.verifyAccount(token,user);
            req.flash('success','Verification mail sent, check your email and verify your account');
            console.log('verification mail sent');
            return res.render('verify_email_info',{
                title:"fyn | Verify"
            });
        }
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in sign up (create)',err);
        res.redirect('/');
    }
}

// sign in and create a session
module.exports.createSession=function(req,res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}
// sign out and destroy session
module.exports.destroySession=function(req,res){
    // logout function is given to req by passport.js
    req.flash('success','Logged out successfully');
    req.logout();
    return res.redirect('/');
}
