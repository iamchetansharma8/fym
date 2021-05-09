const User=require('../models/user');
const Topic=require('../models/topic');

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
                return res.render('home',{
                    title:'Find User',
                    all_users:users,
                    noMatch: noMatch,
                    searched:searched,
                    by_name:by_name,
                    by_topic:by_topic
                });
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
                return res.render('home',{
                    title:'Find User',
                    all_topics:topics,
                    noMatch: noMatch,
                    searched:searched,
                    by_name:by_name,
                    by_topic:by_topic
                });
            }
        });
    }
    else{
        User.find({},function(err,users){
            return res.render('home',{
                title:'Home',
                all_users:users,
                noMatch: noMatch,
                searched:searched
            });
        });
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};