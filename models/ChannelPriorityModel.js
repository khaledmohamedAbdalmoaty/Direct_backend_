const mongoose = require("mongoose");
const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const channelSchema={type:mongoose.Schema.Types.ObjectId,ref:'Channels',required: true}

const ChannelPrioritySchema = new mongoose.Schema(
    {   
        userIdModel:userSchema,
        userId:String,
        channelIdModel:channelSchema,
        channelId:String,
        priority:{type:Number,default:10000},
        subscribeRelation:{type:Boolean,default:false}
    });

module.exports = mongoose.model("ChannelPriority", ChannelPrioritySchema);
