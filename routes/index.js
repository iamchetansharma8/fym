const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
const connectionController=require('../controllers/connection_controller');
const passport = require('passport');

router.get('/',homeController.home);
router.post('/manage-connection/:id',passport.checkAuthentication,connectionController.followUnfollow);
router.post('/home-msg',passport.checkAuthentication,homeController.homeChat);
router.use('/users',require('./users'));
// redirecting control to post router
router.use('/post',require('./post'));
router.use('/comment',require('./comment'));

router.use('/topics',require('./topic'));
router.use('/likes',require('./like'));

// routing to api index
router.use('/api',require('./api'));
module.exports=router;