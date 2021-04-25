const mongoose=require('mongoose');

const topicSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    posts:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Post'
        }
    ],
    users:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
},{
    timestamps:true
});

const Topic=mongoose.model('Topic',topicSchema);
module.exports=Topic;