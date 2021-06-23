const mongoose=require('mongoose');

const comChatSchema=new mongoose.Schema({
    message:{
        type: String,
    },
    email:{
        type: String,
        required :true
    },
    curTime:{
        type: String,
        required: true
    }
    // room:{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'Room'
    // }
},{
    timestamps:true
});

const ComChat=mongoose.model('ComChat',comChatSchema);
module.exports=ComChat;