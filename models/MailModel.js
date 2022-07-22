const mongoose=require('mongoose')

const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const postSchema={type:mongoose.Schema.Types.ObjectId,ref:'Posts',required:true}
const insideEmailSchema={type:mongoose.Schema.Types.ObjectId,ref:'EmailInbox'}

const EmailSchema=new mongoose.Schema({
   from:userSchema,
   from_id:{type:String,default:''},
   to:userSchema,
   to_id:{type:String,default:''},
   headerTitle:String,
   emailBody:String,
   enableImage:{type:Boolean,default:false},
   imageLoacation:String,
   enableReply:{type:Boolean,default:false},
   replyMessage:String,
   replyOnMail:insideEmailSchema,
   replyEmailId:String,
   timestamp:{  
    type:Date,
    default:Date.now()
  }
})


const EmailInboxModel=mongoose.model(`EmailInbox`,EmailSchema)

module.exports={EmailInboxModel}