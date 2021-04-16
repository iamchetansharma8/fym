const express=require('express');
const passport = require('passport');
const router=express.Router();
const postController=require('../controllers/post_controller');
router.get('/create_page',passport.checkAuthentication,postController.createPage);
router.post('/create',passport.checkAuthentication,postController.create);

// for editing
// router.get('/edit/:post_id',passport.checkAuthentication,postController.editPage);

router.get('/all_posts',postController.showPosts);

router.get('/read_full/:post_id',postController.fullPost);

module.exports=router;