const Topic=require('../models/topic');
const User=require('../models/user');

module.exports.addOrCreateTopic=async function(req,res){
    try{
        if(req.user.id!=req.params.id){
            req.flash('error','Unauthorized!!');
            return res.redirect('back');
        }
        let topic=await Topic.findOne({
            name:req.body.name
        });
        let user=await User.findById(req.user._id)
        if(topic){
            let check=await User.findOne({_id:req.user._id ,topics: topic._id});
            if(check){
                req.flash('warning','Subject interest already added!!');
                return res.redirect('back');
            }
            user.topics.push(topic._id);
            user.save();
            topic.users.push(req.user._id);
            topic.save();
            req.flash('success','Subject interest added!!');
            return res.redirect('back');
        }
        topic=await Topic.create({
            name:req.body.name,
        });
        user.topics.push(topic._id);
        user.save();
        topic.users.push(req.user._id);
        topic.save();
        req.flash('success','Subject interest created and added to profile!!');
        return res.redirect('back');
    }catch(err){
        console.log('Error in creating/adding new topic');
        return res.redirect('back');
    }
}