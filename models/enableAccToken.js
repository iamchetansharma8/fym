const mongoose=require('mongoose');
const enableAccSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    accessToken:{
        type:String
    },
    isVerified:{
        type:Boolean
    }
},
{
    timestamps:true
});
const EnableAccessToken=mongoose.model('EnableAccessToken',enableAccSchema);
module.exports=EnableAccessToken;