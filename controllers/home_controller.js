const User=require('../models/user');
const Topic=require('../models/topic');
const ComChat=require('../models/comChat');
const Room=require('../models/room');

module.exports.home=function(req,res){
    let noMatch = null,searched=false,by_name=false,by_topic=false;
    if(req.query.namesearch){
        searched=true;
        by_name=true;
        const regex = new RegExp(escapeRegex(req.query.namesearch), 'gi');
        User.find({name:regex},function(err,users){
            if(err){
                console.log(err);
            }else{
                if(users.length < 1) {
                    noMatch = "No user matched that query, please try again.";
                }
                Room.find({name:'fymroom'})
                    .populate({
                        path:'messages'
                    })
                    .exec(function(err,room){
                        return res.render('home',{
                            title:'Find User',
                            all_users:users,
                            noMatch: noMatch,
                            searched:searched,
                            by_name:by_name,
                            by_topic:by_topic,
                            room:room[0]
                        });
                    })
            }
        });
    }
    else if(req.query.topicsearch){
        searched=true;
        by_topic=true;
        const regex = new RegExp(escapeRegex(req.query.topicsearch), 'gi');
        Topic.find({name:regex}).populate({path:'users'}).exec(function(err,topics){
            if(err){
                console.log(err);
            }else{
                if(topics.length < 1) {
                    noMatch = "Topic does'nt exist as of now, you can create it in you profile section";
                }
                User.find({},function(err,users){
                    Room.find({name:'fymroom'})
                    .populate({
                        path:'messages'
                    })
                    .exec(function(err,room){
                        return res.render('home',{
                            title:'Find User',
                            all_topics:topics,
                            noMatch: noMatch,
                            searched:searched,
                            by_name:by_name,
                            by_topic:by_topic,
                            room:room[0]
                        });
                    });
            });
        }
        });
    }
    else{
        User.find({},function(err,users){
            Room.find({name:'fymroom'})
            .populate({
                path:'messages'
            })
            .exec(function(err,room){
                return res.render('home',{
                    title:'Home',
                    all_users:users,
                    noMatch: noMatch,
                    searched:searched,
                    room:room[0]
                });
            });
        });
    }
}

module.exports.homeChat=async function(req,res){
    try{
        console.log('jj',req.body);
        let user=await User.findOne({email:req.body.myData.email});
        console.log('profile**id',req.body.myData.profile_id);
        if(req.body.myData.profile_id!=undefined){
        var is_active=false;
        for(iter of user.active){
            if(iter==req.body.myData.profile_id){
                is_active=true;break;
            }
        }
        if(!is_active){
            let profile_user_cur=await User.findById(req.body.myData.profile_id);
            user.active.push(profile_user_cur);
            user.save();
            profile_user_cur.active.push(user);
            profile_user_cur.save();
            console.log("oooo pushhed");
        }
        }
        let room=await Room.findOne({name:req.body.myData.chatroom});
        let room1=await Room.findOne({name:req.body.myData.chatroom})
        .populate({
            path:'messages',
        });
        if(!room){
            room=await Room.create({
                name:req.body.myData.chatroom,
            });
        }
        let curChat=await ComChat.create({room:room,message:req.body.myData.msg,email:req.body.myData.email,curTime:req.body.myData.timeCur});
        console.log(curChat,"pp")
        console.log('#er',user.email)
        let yes=false;
        for(i of room1.messages){
            if(i.email==user.email){
                yes=true;
            }
        }
        // let yes=await Room.findOne({
        //     name:req.body.myData.chatroom,
        //     users: { 
        //        $elemMatch: { email:user.email } 
        //     }
        //  });
         console.log('yes : ',yes)
         if(!yes){
             await room.users.push(user);
            //  room.save();
         }
         console.log(curChat,"pqp")
         await room.messages.push(curChat);
         console.log(room,'ll : room')
         room.save();
         return res.status(200).json({
            message:"Post Created",
            data:{
                curChat:curChat.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        });
    }catch(err){
        console.log('Error in posting send message request home',err);
        req.flash('error',err);
        return res.redirect('back');
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};