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
            }else{ //hh
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
                // return res.render('home',{
                //     title:'Find User',
                //     all_users:users,
                //     noMatch: noMatch,
                //     searched:searched,
                //     by_name:by_name,
                //     by_topic:by_topic
                // });
            } //hh
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
                // return res.render('home',{
                //     title:'Find User',
                //     all_topics:topics,
                //     noMatch: noMatch,
                //     searched:searched,
                //     by_name:by_name,
                //     by_topic:by_topic
                // });
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
                // if(!room){
                //     Room.create({name:'fymroom'},function(err,room2){
                //         console.log('room created : ',room2);
                //         room=room2;
                //     });
                // }
                // console.log('room::',room[0]);
                // console.log('mess:',room[0].messages[0].message)
                return res.render('home',{
                    title:'Home',
                    all_users:users,
                    noMatch: noMatch,
                    searched:searched,
                    room:room[0]
                });
            });
            // ComChat.find({},function(err,all_msgs){
            //     return res.render('home',{
            //         title:'Home',
            //         all_users:users,
            //         noMatch: noMatch,
            //         searched:searched,
            //         all_com_msgs:all_msgs
            //     });
            // })
            // return res.render('home',{
            //     title:'Home',
            //     all_users:users,
            //     noMatch: noMatch,
            //     searched:searched
            // });
        });
    }
}

module.exports.homeChat=async function(req,res){
    try{
        console.log('jj',req.body.myData);
        let user=await User.findOne({email:req.body.myData.email});
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
        let curChat=await ComChat.create({room:room,message:req.body.myData.msg,email:req.body.myData.email});
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
            message:"Post Created"
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