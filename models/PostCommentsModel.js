const mongoose=require('mongoose')
const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
  
const postCommentSchema=new mongoose.Schema ({
    channelId:String,
    postId:String,
    message:String,
    timestamp:{
        type:Date,
        default:Date.now()
    },
    whoSendMsg:userSchema,//add a reference here for user database do in the next stage 
    received:Boolean
})

const PostCommentsModel=mongoose.model('PostComments',postCommentSchema)
module.exports={PostCommentsModel}