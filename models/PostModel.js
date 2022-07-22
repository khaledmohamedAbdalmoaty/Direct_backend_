const mongoose = require("mongoose");
const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const channelSchema={type:mongoose.Schema.Types.ObjectId,ref:'Channels',required: true}
const PostSchema = new mongoose.Schema(
{   likesCounter:{type:Number,default:0},
    userId:userSchema,
    postPermission:Boolean,
    channelId:channelSchema,
    desc: {
      type: String,
    },
    imageLocation: String
    ,
    likes:[String]  
    ,
    timestamp:{
      type:Date,
      default:Date.now()
    }
});

module.exports = mongoose.model("Posts", PostSchema);

