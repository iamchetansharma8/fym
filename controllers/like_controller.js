const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comment');
module.exports.toggleLike=async function(req,res){
    try{
        // likes/toggle/?id=abcde&type=Post
        let likeable;
        let deleted=false; // if true then we'll decrease like count
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        // check if a like already exists, making sure that a user can like a post or comment only once
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user: req.user._id
        });
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted=true;
        }
        else{
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.redirect('back');
        /*return res.json(200,{
            message:"Like request successfully completed",
            data:{
                deleted:deleted
            }
        });*/
    }catch(err){
        console.log('Error in toggling like',err);
        return res.json(500,{
            message:'Internal Server Error'
        });
    }
}