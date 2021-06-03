const Post = require("../../../models/post");
const Like=require("../../../models/like");
const Comment=require("../../../models/comment");
module.exports.index=async function(req,res){
    let posts=await Post.find({})
    .sort('-createdAt')
    .populate('user','name')

    res.json(200,{
        message:'List of posts from v1',
        posts:posts
    })
}

module.exports.destroy= async function(req,res){
    // finding the post which is to be deleted in db ( it's details have come from user through params.id)
    // callback argument post will contain post to be deleted after it's found without any error
    try{
        let post=await Post.findById(req.params.id);
        // req.user._id is replace by .id as this gives us a string value to compare here
        if(post.user==req.user.id){
            if(!post){
                return res.json(200,{
                    message:"Post not found or is already deleted"
                });
            }
            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});


            post.remove();
            await Comment.deleteMany({Post:req.params.id});
            // only err as single argument as comments have been deleted

            // req.flash('success','Post deleted successfully');
            return res.json(200,{
                message:"Post and associated comments deleted successfully"
            });
        }
        else{
            return res.json(401,{
                message:"You can't delete this post (unauthorised)"
            });
        }
    }
    catch(err){
        // req.flash('error',err);
        console.log('###',err);
        return res.json(500,{
            message:"Internal Server Error",
        });
    }
}