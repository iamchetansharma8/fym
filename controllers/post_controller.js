const Post=require('../models/post');
const Comment=require('../models/comment');
const Like = require('../models/like');

// create new post page
module.exports.createPage=function(req,res){
    return res.render('new_post',{
        title:"fyn | New Post"
    });
}
/*
// creating edit page
module.exports.editPage=async function(req,res){
    Post.findById(req.params.post_id).populate('user','name').exec(function(err,post){
        if(post.user._id!=req.user._id){
            req.flash('error','Unauthorised Action❌');
            return res.redirect('back');
        }
        return res.render('edit_post',{
            title:"fym | "+post.title+"| Edit",
            post:post,
        });
    })
}
*/
// creating new post 
module.exports.create=function(req,res){
    // console.log(req.body.title,'0',req.user._id,'1',req.body.description,'2',req.body.markdown,'3');
    Post.create({
        title:req.body.title,
        user:req.user._id,
        description:req.body.description,
        markdown:req.body.markdown
    },function(err,post){
        if(err){
            console.log('Error in creating post');
            req.flash('error','Error in creating post');
            return;
        }
        console.log('Post published!!');
        req.flash('success','Post published!!');
        return res.redirect('/post/all_posts');
    });
}
module,exports.showPosts=function(req,res){
    let noMatch = null,searched=false;
    if(req.query.search){
        searched=true;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Post.find({title: regex}).populate('user','name').exec(function(err, allPosts){
            if(err){
                console.log(err);
            } else {
               if(allPosts.length < 1) {
                   noMatch = "No posts match that query, please try again.";
               }
               return res.render("all_posts",{
                title:"fym | Searched post Results",
                posts:allPosts,
                noMatch: noMatch,
                searched:searched
            });
            }
         });
    }
    else{
        Post.find({}).populate('user','name').exec(function(err,posts){
            return res.render('all_posts',{
                title:"fym | All posts",
                posts:posts,
                noMatch: noMatch,
                searched:searched
            });
        });
    }
}
module.exports.fullPost=function(req,res){
    if(!req.isAuthenticated()){
        req.flash('alert','Sign in to see the complete article');
        return res.redirect('/post/all_posts');
    }
    Post.findById(req.params.post_id)
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user likes'
        }
    })
    .populate('likes')
    .exec(function(err,post){
        console.log(post);
        res.render('full_post',{
            title:"fym | " +post.title,
            cur_post:post
        });
    })
}
module.exports.destroy= async function(req,res){
    // finding the post which is to be deleted in db ( it's details have come from user through params.id)
    // callback argument post will contain post to be deleted after it's found without any error
    try{
        let post=await Post.findById(req.params.id);
        // req.user._id is replace by .id as this gives us a string value to compare here
        if(post.user==req.user.id){

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});


            post.remove();
            await Comment.deleteMany({Post:req.params.id});
            // only err as single argument as comments have been deleted

            req.flash('success','Post deleted successfully');
            return res.redirect('back');
        }
        else{
            req.flash('error','You can not delete this post');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}
/*
module.exports.destroy=function(req,res){
    Post.findById(req.params.id,function(err,post){
        // .id is the string version of object id
        if(post.user==req.user.id){
            Like.deleteMany({likeable:post,onModel:'Post'});
            Like.deleteMany({_id:{$in:post.comments}});
            post.remove();
            Comment.deleteMany({post:req.params.id},function(err){
                if(err){
                    // notif
                    res.redirect('/post/all_posts');
                }
                // not
                res.redirect('/post/all_posts');
            });
        }
    })
}
*/

// editing the post
// create new post page
module.exports.editPage=function(req,res){
    Post.findById(req.params.id,function(err,post){
        return res.render('edit_post',{
            title:"fyn | Edit Post",
            cur_post:post
        });
    });
}

// editing post
module.exports.edit=function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(post.user==req.user.id){
            post.title=req.body.title;
            post.description=req.body.description;
            post.markdown=req.body.markdown;
            post.save();
            return res.redirect('/post/read_full/'+post.id);
        }
        else{
            return res.status(401).send('Unauthorised');
        }
    })
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
