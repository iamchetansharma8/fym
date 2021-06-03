const express=require('express');
const router=express.Router();

// importing passport to perform authentication before deleting
const passport=require('passport');

const postsApi=require('../../../controllers/api/v1/posts_api');

router.get('/',postsApi.index);

// putting an authentication check before deleting
// authorisation check is put in post_api contoller
router.delete('/:id',passport.authenticate('jwt',{session:false}),postsApi.destroy);

module.exports=router;