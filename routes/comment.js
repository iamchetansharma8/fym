const express=require('express');
const passport = require('passport');
const router=express.Router();
const commentController=require('../controllers/comment_controller');

router.post('/create',passport.checkAuthentication,commentController.create);

// for editing
// router.get('/edit/:post_id',passport.checkAuthentication,postController.editPage);

router.get('/destroy/:id',passport.checkAuthentication,commentController.destroy);

module.exports=router;