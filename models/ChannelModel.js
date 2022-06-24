const mongoose=require('mongoose')

const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const postSchema={type:mongoose.Schema.Types.ObjectId,ref:'Posts',required:true}


const channelsSchema=new mongoose.Schema({
    priority:{type:Number},
    channelName:{type:String,required: true},
    channelImageLocation:String,
    channelOwner:userSchema,
    channelType:String,
    postOnly:{type:Boolean,default:false},
    BlockedUser:{
            type: Array,
            default: []
    },
    subScribers:{
        type: Array,
        default: [],
      
    },
    Admin:{
        type: Array,
        default: [],       
    },
})


const ChannelModel=mongoose.model(`Channels`,channelsSchema)

module.exports={ChannelModel}