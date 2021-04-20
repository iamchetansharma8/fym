const Comment=require('../models/comment');
const Post=require('../models/post');
const Like=require('../models/like');
module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,comment){
                // handle error
                if(err){
                    console.log('error in creating comment',err);
                    res.redirect('back');
                }
                post.comments.push(comment);
                post.save();
                res.redirect('back');
            });
        }
    })
}

module.exports.destroy=async function(req,res){
    try{
        let comment=await Comment.findById(req.params.id);
        if(comment.user==req.user.id){
            let postId=comment.post;
            comment.remove();
            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
            req.flash('success','Comment deleted!!');
            return res.redirect('back');
        }
        else{
            console.log('Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error in deleting comment',err);
        return res.redirect('back');
    }
}