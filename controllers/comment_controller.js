const Comment=require('../models/comment');
const Post=require('../models/post');

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

module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(err){
            console.log('Error in finding comment in db');
            // notif
            return res.redirect('back');
        }
        if(comment.user==req.user.id){
            let postId=comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
                return res.redirect('back');
            });
        }
        else{
            console.log('Unauthorized');
            return res.redirect('back');
        }
    })
}