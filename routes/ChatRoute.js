const router=require("express").Router()
const {ConversationModel}=require('../models/ConversationModel')
const {ChannelModel}=require('../models/ChannelModel')
/* -------------------------------------------------------------------------- */
/*                                  api route                                 */
/* -------------------------------------------------------------------------- */


/* ------------------------------ get conversagtion message  ------------------------------ */

router.get('/get/conversationMsg',async (req,res)=>{    
  

    try{
        const channelId= req.query.id    
        if(!channelId){return res.status(500).send('Error')}
        const channel=await ChannelModel
        .findById(channelId)
       /*  .populate('channelOwner','_id  username ') */
        const conversation=await ConversationModel
        .find({channelId})
        .populate('whoSendMsg','-subsribeToChannel -userChannel -email -password -uid ') 
        .populate({path:'post',model:'Posts',populate:{path:"channelId",model:"Channels"}})
        /*  msg.post.channelId.channelOwner */

        const channelData={
            channel,
            conversation
        }

        return res.status(200).send(channelData) 

    }
    catch(err){
        res.status(500).send(err.message)
    }
   
})

/* ----------------------------- save new conversatino message to database  ----------------------------- */

router.post('/new/conversationMsg',async(req,res)=>{
    const channelId=req.query.id;
    if(!channelId){return res.status(500).send('internal server #error')}
    const newMessage=req.body
  /*   console.log(`id from /new/conversationMsg => who send mesg => ${newMessage.whoSendMsg}`)
    console.log(`id from /new/conversationMsg => channelId => ${channelId}`)
    console.log(`id from /new/conversationMsg => req.body.anything => ${req.body}`) */
    try{
        const result= new ConversationModel(newMessage)
        await result.save()
        return  res.status(200).send(result)
       
    }
    catch(err){
        return res.status(500).send(`error => ${err.message}`)
    }
  
})

module.exports=router