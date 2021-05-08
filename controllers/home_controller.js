const User=require('../models/user');

module.exports.home=function(req,res){
    let noMatch = null,searched=false;
    if(req.query.search){
        searched=true;
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
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
                    searched:searched
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