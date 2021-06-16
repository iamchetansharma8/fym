const user  = require('../config/mongoose');
const User=require('../models/user');
const Post=require('../models/post');
const Room=require('../models/room');
const Topic=require('../models/topic');
const ResetPassToken=require('../models/resetPassToken');
const EnableAccessToken=require('../models/enableAccToken');
const fs=require('fs');
const path=require('path');
const signUpMailer=require('../mailers/sign-up');
const verifyMailer=require('../mailers/verify_acc');
const forgotPassMailer=require('../mailers/forgot-pass');
const crypto=require('crypto');
const { verifyAccount } = require('../mailers/verify_acc');
const { model } = require('mongoose');

// rendering user profile page
module.exports.profile=async function(req,res){
    try{
    console.log(req.params.id);
    // let user=await User.findById(req.params.id).populate('connections')
    let user=await User.findById(req.params.id)
    .populate({
        path:'connections',
        populate:{
            path:'follower following'
        }
    })
    .populate({
        path:'topics'
    })
    let posts=await Post.find({
        user:req.params.id
    }).sort('-createdAt');
    let roomName;
    let x=Date.parse(req.user.createdAt);
    let y=Date.parse(user.createdAt);
    let m=(x<=y);
    if(m){
        roomName="chat-Box-"+req.user.id+user.id;
    }else{
        roomName="chat-Box-"+user.id+req.user.id;
    }
    let room=await Room.find({name:roomName})
    .populate({
        path:'messages'
    });
    console.log('roooom : ',room[0]);
    return res.render('user_profile',{
        title:"Users's profile",
        profile_user:user,
        posts:posts,
        room:room[0]
    });
}catch(err){
    console.log('Error in showing profile page',err);
    return res.redirect('back');
}
}

// rendering sign up page
module.exports.signUp=function(req,res){
    // if user is already signed in no need to show signup page
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('user_sign_up',{
        title:"fym | Sign Up"
    })
}

// rendering sign in page
module.exports.signIn=function(req,res){
    // if user is already signed in no need to show signIn page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/req.user.id');
    }
    return res.render('user_sign_in',{
        title:"fym | Sign In"
    })
}

// rendering reset password page
module.exports.resetPasswordPage=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/');
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
            title:"fym | Reset Password",
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
            return res.redirect('/');
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
            title:"fym | Verify Account",
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
            return res.redirect('/');
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
            return res.redirect('/');
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
        return res.redirect('/');
    }
    return res.render('forgot_password',{
        title:"fym | Forgot Password"
    })
}

// reset password object creation and sending email
module.exports.reset_pass=async function(req,res){
    try{
        // if user is already signed in no need to proceed further
        if(req.isAuthenticated()){
            return res.redirect('/');
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
        if(user){
            req.flash('warning','The email address you entered is already registered with us, sign in instead');
            return res.redirect('/users/sign_in');
        }
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
                title:"fym | Verify"
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

module.exports.update=async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("Multer error:",err);
                }
                user.name=req.body.name;
                if(req.file){
                    console.log('kk',__dirname,user.avatar);
                    if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    // saving the path of the uploaded file into the avatar field of user
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            console.log('Error in updating',err);
            req.flash('Error in updating',err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorised');
    }



    /*if(req.user.id==req.params.id){
        User.findById(req.params.id,function(err,user){
            if(err){
                console.log('Error in finding user');
                return res.redirect('/');
            }
            user.name=req.body.name;
            user.save();
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorised');
    }*/
}