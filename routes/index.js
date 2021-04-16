const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
// redirecting control to post router
router.use('/post',require('./post'));

router.get('/',homeController.home);
router.use('/users',require('./users'));
module.exports=router;