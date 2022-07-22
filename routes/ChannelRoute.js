const router=require("express").Router()
const {ChannelModel}=require('../models/ChannelModel')
const UserModel=require('../models/UserModel')
const ChannelPriorityModel=require('../models/ChannelPriorityModel')



/* -------------------------------------------------------------------------- */
/*                                  api route                                 */
/* -------------------------------------------------------------------------- */

/* ------------------------- 1.1 create new channel ------------------------- */

router.post('/new/channel',async(req,res)=>{
  try{
    const channelOwnerId=req.body.channelOwner
    const channelOwnerInfo=await UserModel.findById(channelOwnerId)
    if(channelOwnerId!=channelOwnerInfo._id)return res.status(403).send('please register to our website')
    const newChannelCard={
      channelName:req.body.channelName,
      channelOwner:channelOwnerId,
      priority:req.body.priority,
      postOnly:req.body.postOnly,
      privateChannel:req.body.privateChannel,
      subScribersCanMakePost:req.body.subScribersCanMakePost
    }
    const newChannel=new ChannelModel(newChannelCard)
    const result_1=await newChannel.save()
    const newPriorityChannel={
      userIdModel:result_1.channelOwner,
      userId:result_1.channelOwner,
      channelIdModel:result_1._id,
      channelId:result_1._id,
      priority:req.body.priority,
    }
    ChannelPriorityModel.create(newPriorityChannel,async (err,data)=>{
       if(err) res.status(500).send(err)
       else {
        const channelData=await  ChannelPriorityModel.find({channelId:data.channelId}).populate({path:'channelIdModel',model:"Channels",populate:{path:'channelOwner',select:{ 'subsribeToChannel':0,'email':0,'password':0,"uid":0},model:"Users"}})

        res.status(201).send(channelData[0])

       }
   })

  }
  catch(err){
    return res.status(500).send(err)
  }
 
})

/* --------------------------- 1.2 delete channel --------------------------- */

router.delete('/delete/channel',async(req,res)=>{
  try{
      const userId=req.body.userId
      const channelId=req.body.channelId
      if(!userId || !channelId) return res.status(500).send('id is required')
      //remove channel from channel priority model first 
       
      ChannelPriorityModel.findOneAndRemove( { $and: [ { userId }, {channelId} ]},async (err,data)=>{
          console.log( `from delete channel route :${data}`)
          if(err|| data==null){
            return res.status(500).send({msg:'err',err})
          }
          if(data.subscribeRelation){
            //remove from channel Model 
          await ChannelModel.remove({_id:channelId})
          return res.status(200).send('deleted channel',data) 
          }
          res.status(200).send({msg:"Deleted channel",data})

      }) 
  }
  catch(err){
    return res.status(500).json({"error":err})
  }
 
})





/* -------------------------------------------------------------------------- */
/*                       1.3 change channel priority number                       */
/* -------------------------------------------------------------------------- */

router.put('/new/priority',async (req,res)=>{

  try{
    const channelId=req.body.channelId
    const priority=req.body.priority
    const userId=req.body.userId
    if(!channelId || !priority ||!userId)return res.status(500).send(`update process failed`)

    const updatedChannel=await ChannelPriorityModel.find({userId,channelId})
    console.log(`updatedChannel_id:${updatedChannel[0]}`)
    const result=await ChannelPriorityModel.update({_id:updatedChannel[0]._id},{priority})
    res.status(200).send({message:'success change priority ',data:result})
  }
  catch(err){

    return res.status(500).send(err.message)

  }

 
})



/* --------------1.4 get list of channle related to specific user -------------- */
router.get('/get/channelList/:userId',async(req,res)=>{
    try{
        const userId=req.params.userId
        const currentUserData=await UserModel
        .findById(userId)
        .select({_id:1,workTitle:1,profilePicture:1,username:1})

        const allChannel=await ChannelPriorityModel
        .find({userId})
       /* .populate({path:'channelIdModel',model:"Channels",populate:{path:'channelOwner',select:{ 'subsribeToChannel':0,'email':0,'password':0,"uid":0,"userChannel":0},model:"Users"}}) */

        .populate({path:'channelIdModel',model:"Channels",populate:{path:'channelOwner',select:{'_id':1,/* "userImageLocation":1 */},model:"Users"}})
        .sort({priority:1}) 
        const allChannelData={
          currentUserData,allChannel
        }
      res.status(200).send(allChannelData)
    }

  catch(err){
      return res.status(500).send(err)
  }
})
 

/* ---------------------1.10 get all channel on our database --------------------- */
router.post("/allChannel",async(req, res) => {
    try {
      const channels = await  ChannelModel.find({});
      res.status(200).send(channels);
    }
    catch (err) {
      res.status(500).send(err);
    }
}); 
    

 
/* ------------------------------1.5 subscribe to channel ----------------------------- */

router.put("/:id/subscribe", async (req, res) => {
        const userId=req.body.userId
        const channelId=req.params.id
        //we should use transaction but fawn is not working 
        if(!userId || !channelId){return res.status(500).send("userId and channelId is required")}
        try {
          const {subScribers}=await ChannelModel.findById(channelId)
          for(i=0;i<subScribers.length;i++){
            if(subScribers[i]===userId){
            return res.status(500).send("You alread subscript to channel ")
            break}

            continue
          }
            const channel=await ChannelModel.findByIdAndUpdate(channelId,{ $push: {  subScribers: userId} });
           const user = await UserModel.updateOne({_id:userId},{ $push: {  subsribeToChannel: channelId } });
           const newPriorityChannelCard={
            userIdModel:userId,
            userId:userId,
            channelIdModel:channelId,
            channelId:channelId,
            subscribeRelation:true
          }
          const newPriorityChannel=new ChannelPriorityModel(newPriorityChannelCard)
          newPriorityChannel.save((err,data)=>{
            if(err)return res.status(500).json(err)
            else return res.status(200).send(data)
          })
        } 
       catch (err) {
         res.status(500).send(err);
       }
   


}); 
  
/* ----------------------------- 1.5 unsubscribe to channel  ---------------------------- */

/* db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )
 */  
router.put("/:id/unsubscribe", async (req, res) => {
  const userId=req.body.userId
  const channelId=req.params.id
  if(!userId || !channelId){return res.status(500).send("userId and channelId is required")}

try {
    const channel=await ChannelModel.findByIdAndUpdate(channelId,{ $pull: {  subScribers: userId} });
    const user = await UserModel.updateOne({_id:userId},{ $pull: {  subsribeToChannel: channelId } });
    const channelFromPriortyChannel=ChannelPriorityModel.findOneAndRemove( { $and: [ { userId }, {channelId} ] }, (err, data)=>{
      if(err)return res.status(500).send(err)
      else return res.status(200).send(data)
    })
}

catch (err) {
  res.status(500).send(err);
}
     
});



/* --------------------- 1.6 block user  from an channel -------------------- */
router.put("/blockUser", async (req, res) => {
 

try {
    const userId=req.body.userId
    const channelId=req.body.channelId
    if(!userId || !channelId){return res.status(500).send("userId and channelId is required")}
    //start block work 
    const BlockedUser=await ChannelModel.updateOne({_id:channelId},{ $push: {BlockedUser: userId} });
    const user = await UserModel.updateOne({_id:userId},{ $pull: {  subsribeToChannel: channelId } });
    const channelFromPriortyChannel=ChannelPriorityModel.findOneAndRemove( { $and: [ { userId }, {channelId} ] }, (err, data)=>{
      if(err)return res.status(500).send({msg:'1',err:err.message})
      else return res.status(200).send({msg:'success block user',data:data})
    })
}

catch (err) {
  res.status(500).send({msg:'2',err:err.message});
}
     
});

/* -------------------- 1.7 unblock user from an channel -------------------- */
router.put("/unBlockUser", async (req, res) => {
  const userId=req.body.userId
  const channelId=req.body.channelId
  if(!userId || !channelId){return res.status(500).send("userId and channelId is required")}

try {
    const BlockedUser=await ChannelModel.findByIdAndUpdate(channelId,{ $pull: {BlockedUser: userId} });
    return res.status(200).send({msg:'successfully unblock user',data:BlockedUser})
}

catch (err) {
  res.status(500).send(err,message);
}
     
});
   

/* -------------------------------------------------------------------------- */
/*                            1.8 find your channel                           */
/* -------------------------------------------------------------------------- */

router.get('/search/channel',async(req,res)=>{
  try{
    const search=req.query.search
    console.log(`from search about channel : ${search}`)
    
    const result=await ChannelModel
    .find({channelName:{ $regex:search,$options: 'i' } })
    .populate('channelOwner','_id')
    res.status(200).send(result)
  }
  catch(err){
    res.status(500).send(err.message)
  }

})




module.exports=router