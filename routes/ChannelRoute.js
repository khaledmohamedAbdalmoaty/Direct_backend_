const router=require("express").Router()
const {ChannelModel}=require('../models/ChannelModel')
const UserModel=require('../models/UserModel')



/* -------------------------------------------------------------------------- */
/*                                  api route                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------- create new channel --------------------------- */
/* router.post('/new/channel',(req,res)=>{
    const saved={
        channelName:req.body.channelName,
        channelOwner:req.body.channelOwner,
        priority:req.body. priority,

        conversation:[
            {
                message:req.body.message,
                whoSendMsg:req.body.whoSendMsg,
                ImageEnable:true,
                uploadImage:req.body.uploadImage,
                received:true,
            }
        ],
        channelType:req.body.channelType,
        postOnly:req.body.postOnly,
        subScribers:req.body.subScribers
    }
   ChannelModel.create(saved,(err,data)=>{
       if(err) res.status(500).send(err)
       else res.status(201).send(data)
   })
}) */

router.post('/new/channel',(req,res)=>{
  const saved={
      channelName:req.body.channelName,
      channelOwner:req.body.channelOwner,
      priority:req.body.priority,
      postOnly:req.body.postOnly
  }
 ChannelModel.create(saved,(err,data)=>{
     if(err) res.status(500).send(err)
     else res.status(201).send(data)
 })
})

/* -------------- get list of channle related to specific user -------------- */
router.get('/get/channelList/:userId',async(req,res)=>{
    const userId=req.params.userId
    try{
        const channelDataAll=await ChannelModel
        .find({channelOwner:userId})
        .populate('channelOwner','')
         .sort({priority:1}) 
        console.log(channelDataAll)
        let channels=[]
        channelDataAll.map((channelData)=>{
            const channelInfo={
                id:channelData._id,
  
                postOnly:channelData.postOnly,
                name:channelData.channelName,
                channelOwner:channelData.channelOwner,
                subScribers:channelData.subScribers,
                channelImageLocation:channelData.channelImageLocation? channelData.channelImageLocation : "not found"
            }
            channels.push(channelInfo)
        })
      res.status(200).send(channels)
    }

  catch(err){
      return res.status(500).send(err)
  }
})
 

/* --------------------- get all channel on our database --------------------- */
router.post("/allChannel",async(req, res) => {

    try {
      const channels = await  ChannelModel.find({});
      res.status(200).send(channels);
    }
    catch (err) {
      res.status(500).send(err);
    }
}); 
    

 
/* ------------------------------ subscribe to channel ----------------------------- */

router.put("/:id/subscribe", async (req, res) => {
        const userId=req.body.userId
        const channelId=req.params.id
        console.log(userId)
        //we should use transaction but fawn is not working 
        if(!userId || !channelId){return res.status(500).send("userId and channelId is required")}
        try {
          const {subScribers}=await ChannelModel.findById(channelId)
          for(i=0;i<subScribers.length;i++){
            if(subScribers[i]===userId)return res.status(500).send("You alread subscript to channel ")
            continue
          }
            const channel=await ChannelModel.findByIdAndUpdate(channelId,{ $push: {  subScribers: userId} });
           const user = await UserModel.updateOne({_id:userId},{ $push: {  subsribeToChannel: channelId } });
          /*  res.status(200).send({channel,user});  */
           res.status(200).send({user});
        } 
       catch (err) {
         res.status(500).send(err);
       }
   


}); 
  
/* ----------------------------- unsubscribe to channel  ---------------------------- */
  
router.put("/:id/unsubscribe", async (req, res) => {
  const userId=req.body.userId
  const channelId=req.params.id
  if(!userId || !channelId){return res.status(500).send("userId and channelId is required")}

try {
    const channel=await ChannelModel.findByIdAndUpdate(channelId,{ $pull: {  subScribers: userId} });
    const user = await UserModel.updateOne({_id:userId},{ $pull: {  subsribeToChannel: channelId } });
    res.status(200).send({channel});
} 
catch (err) {
  res.status(500).send(err);
}
     
});
   

module.exports=router