const Post=require('../models/post');
const Comment=require('../models/comment');

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
    Post.find({}).populate('user','name').exec(function(err,posts){
        return res.render('all_posts',{
            title:"fym | All posts",
            posts:posts
        });
    })
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
            path:'user'
        }
    })
    .exec(function(err,post){
        console.log(post);
        res.render('full_post',{
            title:"fym | " +post.title,
            cur_post:post
        });
    })
}

module.exports.destroy=function(req,res){
    Post.findById(req.params.id,function(err,post){
        // .id is the string version of object id
        if(post.user==req.user.id){
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