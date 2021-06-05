const mongoose=require('mongoose');

const RoomSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    users:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }],
    messages:[{
        type:mongoose.Schema.ObjectId,
        ref:'ComChat'
    }]
});

const Room=mongoose.model('Room',RoomSchema);
module.exports=Room;
