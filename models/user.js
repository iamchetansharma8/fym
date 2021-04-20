const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    verified:{
        type:Boolean,
        default: false
    },
    avatar:{
        type:String,
        default:'hh'
    },
    connections:[{
        type: mongoose.Schema.ObjectId,
        ref:'Connection'
    }],
    nfollowers:{
        type:Number,
        default:0
    }
},
{
    timestamps:true

});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });

// static function, single to tell that only one file will'be uploaded for filename avatar
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
// making AVATAR_PATH publicly available as avatarPath
userSchema.statics.avatarPath=AVATAR_PATH;

const User=mongoose.model('User',userSchema);
module.exports=User;