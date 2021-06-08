const User=require('../models/user');

module.exports.showActive=async function(req,res){
    try{
        let user_now=await User.findById(req.user.id).populate({
            path:'active'
        });
        return res.render('active',{
            title:'Active Chats',
            now_user:user_now
        });
    }catch(err){
        console.log('Error in displaying active users ',err);
        return res.redirect('back');
    }
}

module.exports.makeInactive=async function(req,res){
    try{
        // let user_now=await User.findById(req.user.id).populate({
        //     path:'active'
        // });
        let user_now=await User.findByIdAndUpdate(req.user.id,{$pull:{active:req.params.id}});
        user_now.save();
        let user_prof=await User.findByIdAndUpdate(req.params.id,{$pull:{active:req.user.id}});
        user_prof.save();
        return res.redirect('back');
    }catch(err){
        console.log('Error in making chat inactive : ',err);
        return res.redirect('back');
    }
}