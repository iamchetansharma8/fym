const mongoose=require('mongoose');
const resetPassSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    accessToken:{
        type:String
    },
    isValid:{
        type:Boolean
    }
},
{
    timestamps:true
});
const ResetPassToken=mongoose.model('ResetPassToken',resetPassSchema);
module.exports=ResetPassToken;