const Connection=require('../models/connection');
const User=require('../models/user');
// follow or unfollow someone
module.exports.followUnfollow=async function(req,res){
    try{
        if(req.user.id==req.params.id){
            console.log('Not allowed');
            res.redirect('back');
        }
        let user2=await User.findById(req.params.id);
        if(!user2){
            console.log('Requested user does not exist');
            return res.redirect('back');
        }
        await user2.populate('connections');
        let user1=await User.findById(req.user.id);
        await user1.populate('connections');
        let cur_connection=await Connection.findOne({follower:req.user.id,following:req.params.id});
        /*if(!cur_connection){
            cur_connection=await Connection.findOne({follower:req.params.id,following:req.user.id});
        }*/
        if(cur_connection){
            await User.findByIdAndUpdate(user1.id,{$pull:{connections:cur_connection.id}});
            await User.findByIdAndUpdate(user2.id,{$pull:{connections:cur_connection.id}});
            cur_connection.remove();
            console.log('unfollowed');
            user2.nfollowers=user2.nfollowers-1;
            user2.save();
            req.flash('warning','You unfollowed ',user2.name);
            return res.redirect('back');
        }
        cur_connection=await Connection.create({
            follower:req.user.id,
            following:req.params.id
        });
        user1.connections.push(cur_connection);
        user1.save();
        user2.connections.push(cur_connection);
        user2.save();
        user2.nfollowers=user2.nfollowers+1;
        user2.save();
        req.flash('success','You started following ',user2.name);
        console.log('You started following ',user2.name);
        return res.redirect('back');
    }catch(err){
        console.log('Error in following/unfollowing',err);
    }
}