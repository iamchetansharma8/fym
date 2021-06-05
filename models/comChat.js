const mongoose=require('mongoose');

const comChatSchema=new mongoose.Schema({
    message:{
        type: String,
    },
    email:{
        type: String,
        required :true
    }
    // room:{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'Room'
    // }
});

const ComChat=mongoose.model('ComChat',comChatSchema);
module.exports=ComChat;