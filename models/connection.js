const mongoose=require('mongoose');

const connectiontSchema=new mongoose.Schema({
    follower:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    following:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const Connection=mongoose.model('Connection',connectiontSchema);
module.exports=Connection;