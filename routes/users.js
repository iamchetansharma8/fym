const express=require('express');
const router=express.Router();
const passport=require('passport');
const usersController=require('../controllers/user_controller');
router.get('/profile',passport.checkAuthentication,usersController.profile);
router.get('/sign_up',usersController.signUp);
router.get('/sign_in',usersController.signIn);
router.get('/forgot_password',usersController.forgotPass);

// reset password page
router.get('/reset/:token',usersController.resetPasswordPage);

// resetting password
router.post('/reset/:token',usersController.finalReset);

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