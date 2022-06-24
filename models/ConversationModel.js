const mongoose=require('mongoose')

const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const postSchema={type:mongoose.Schema.Types.ObjectId,ref:"Posts"}
  

const uploadImageSchema={
    imageLocaton:String,
    imageCaption:String
}



const conversationSchema=new mongoose.Schema ({
    channelId:String,
    message:String,
    timestamp:{
        type:Date,
        default:Date.now()
    },
    whoSendMsg:userSchema,//add a reference here for user database do in the next stage 
    uploadedImageEnable:Boolean,
    uploadedImage:uploadImageSchema,
    postEnable:Boolean,
    post:postSchema,
    received:Boolean
})

const ConversationModel=mongoose.model('Conversation',conversationSchema)
module.exports={ConversationModel}