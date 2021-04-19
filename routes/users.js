const express=require('express');
const router=express.Router();
const passport=require('passport');
const { pass } = require('../config/mongoose');
const usersController=require('../controllers/user_controller');
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);
router.get('/sign_up',usersController.signUp);
router.get('/sign_in',usersController.signIn);
router.get('/forgot_password',usersController.forgotPass);

// reset password page
router.get('/reset/:token',usersController.resetPasswordPage);

// resetting password
router.post('/reset/:token',usersController.finalReset);

// verify email account page
router.get('/verify_email/:token',usersController.verifyEmailPage);

// verifying email account
router.post('/verify_email/:token',usersController.finalVerification);

router.post('/create',usersController.create);

// reset password request
router.post('/reset_pass',usersController.reset_pass);

// use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign_in'},
),usersController.createSession);

// destroy session
router.get('/sign_out',usersController.destroySession);

// making get requests to google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign_in'}),usersController.createSession);



module.exports=router;