const mongoose=require('mongoose');
const marked=require('marked');
const createDomPurify=require('dompurify');
const { JSDOM }=require('jsdom');
const dompurify=createDomPurify(new JSDOM().window);

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    markdown:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    sanitizedHtml:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

postSchema.pre('validate',function(next){
    console.log('cccccc');
    if(this.markdown){
        this.sanitizedHtml=dompurify.sanitize(marked(this.markdown));
    }
    next();
})

const Post=mongoose.model('Post',postSchema);
module.exports=Post;