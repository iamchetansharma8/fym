const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    post:{
        type:mongoose.Schema.ObjectId,
        ref:'Post'
    },
    likes:[{
        type: mongoose.Schema.ObjectId,
        ref:'Like'
    }]
},
{
    timestamps:true
});

const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;