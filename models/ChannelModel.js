const mongoose=require('mongoose')


const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const postSchema={type:mongoose.Schema.Types.ObjectId,ref:'Posts',required:true}
const channelPrioritySchema={type:mongoose.Schema.Types.ObjectId,ref:'Posts',required:true}

const channelsSchema=new mongoose.Schema({
    noSubscribers:{type:Number,default:0},
    channelName:{type:String,required: true},
    channelImageLocation:{type:String,default:'Not found'},
    channelOwner:userSchema,
    privateChannel:{type:Boolean,default:false},
    postOnly:{type:Boolean,default:false},
    subScribersCanMakePost:{type:Boolean,default:false},
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