const router=require("express").Router()
const {ConversationModel}=require('../models/ConversationModel')

/* -------------------------------------------------------------------------- */
/*                                  api route                                 */
/* -------------------------------------------------------------------------- */


/* ------------------------------ get conversagtion message  ------------------------------ */

router.get('/get/conversationMsg',async (req,res)=>{    
    const channelId= req.query.id
    if(!channelId){return res.status(500).send('Error')}
    console.log(`channelId from /get/conversationMsg=> channel channelId =>${channelId}`)
    try{
        const conversation=await ConversationModel
        .find({channelId})
        .populate('whoSendMsg','') 
        .populate('post','')
       
        return res.status(200).send(conversation) 

    }
    catch(err){
        res.status(500).send(err)
    }
   
})

/* ----------------------------- save new conversatino message to database  ----------------------------- */

router.post('/new/conversationMsg',async(req,res)=>{
    const channelId=req.query.id;
    if(!channelId){return res.status(500).send('internal server #error')}
    const newMessage=req.body
    console.log(`id from /new/conversationMsg => who send mesg => ${newMessage.whoSendMsg}`)
    console.log(`id from /new/conversationMsg => channelId => ${channelId}`)
    console.log(`id from /new/conversationMsg => req.body.anything => ${req.body}`)
    try{
        const result= new ConversationModel(newMessage)
        await result.save()
        return  res.status(200).send(result)
       
    }
    catch(err){
        return res.status(500).send(`error => ${err}`)
    }
  
})

module.exports=router