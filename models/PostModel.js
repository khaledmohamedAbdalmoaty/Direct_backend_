const mongoose = require("mongoose");
const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const channelSchema={type:mongoose.Schema.Types.ObjectId,ref:'Channels',required: true}
const PostSchema = new mongoose.Schema(
{   counter:Number,
    userId:userSchema,
    postPermission:Boolean,
    channelId:channelSchema,
    desc: {
      type: String,
    },
    imageLocation: String
    ,
    likes: {
      type: Array,
      default: [],
    },
    timestamp:{
      type:Date,
      default:Date.now()
    }
});

module.exports = mongoose.model("Posts", PostSchema);

