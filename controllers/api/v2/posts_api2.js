module.exports.index=function(req,res){
    res.json(200,{
        message:'List of posts from v2',
        posts:[]
    })
}