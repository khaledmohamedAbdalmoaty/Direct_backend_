const router = require("express").Router();
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const {PostCommentsModel}=require('../models/PostCommentsModel')
const {ConversationModel}=require('../models/ConversationModel')

/* ------------------------------- get post by it's id ------------------------------- */

router.get("/:id", async (req, res) => {
  try {
    const post = await PostModel
    .findById(req.params.id)
    .populate('userId','')
    .populate('channelId','')
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});



/* --------------------- get comments of post by post id -------------------- */

router.get("/getComments/:id", async (req, res) => {
  const postId=req.params.id
  if(!postId){return res.status(500).send("internal server Error")}
  try {
    const result = await PostCommentsModel
    .find({postId})
    .populate('whoSendMsg','_id username profilePicture') 
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error=>"+err);
  } 
});


/* --------------------------- add comment to post -------------------------- */

router.post("/addComment",async (req,res)=>{
  try{
    const comment={
      postId:req.body.postId,
      message:req.body.message,
      channelId:req.body.channelId,
      whoSendMsg:req.body.whoSendMsg
    }
    const result= new  PostCommentsModel(comment)
    await result.save()
    res.status(200).send(result)
  }
 
  catch(err){
    res.status(500).send(err)
  }

})


/* ----------------- get all posts related to specific user ----------------- */

router.get('/user/posts',async (req,res)=>{
  try{
    const userId=req.body.userId
    const posts=await PostModel.find({userId})
    res.status(200).send(posts)

  }catch(err){

    res.status(500).send(` Can not find posts with specific userId => ${err}`)
  }

})


/* ---------------- get all posts related to specific channel --------------- */

router.get('/channel/posts',async (req,res)=>{
  try{
    const channelId=req.body.channelId
    const posts=await PostModel.find({channelId})
    res.status(200).send(posts)
  }catch(err){
    res.status(500).send(` Can not find posts with specific channelId => ${err}`)
  }

})



/* ------------------------------ create a post ----------------------------- */

router.post("/createPost", async (req, res) => {
  const newPostData= {
  userId:req.body.userId,
  channelId:req.body.channelId,
  desc:req.body.desc,
  imageLocation:req.body.imageLocation ? req.body.imageLocation : null
  }
  const newPost = new PostModel(newPostData);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});

/* ------------------------------ update a post ----------------------------- */

router.put("/:id", async (req, res) => {
  const postId=req.params.id
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === req.body.userId) {
      await PostModel.updateOne({ $set: req.body });
      const response={msg:'the post has been updated',post}
      res.status(200).send(response);
    } else {
      res.status(403).send("you can update only your post");
    }
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});


/* ------------------------------ delete a post ----------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const PostId=req.params.id
    const postOwner=req.body.postOwner
    const channelOwnerId=req.body.channelOwnerId
    const msgId=req.body.msgId
    const post = await PostModel
    .findById(PostId)
    .populate({path:'channelId',model:'Channels',populate:{path:'channelOwner',select:{_id:1},model:'Users'}})
    
    const realChannelOwner=post.channelId.channelOwner._id

    if ((post.userId ==postOwner) || (channelOwnerId==realChannelOwner)) {
      await PostModel.deleteOne({_id:PostId})
      await ConversationModel.deleteOne({_id:msgId})
      res.status(200).send(`post has been deleted => ${post}`);
    } else {
      res.status(403).send("you can delete only your post");
    }
  } catch (err) {
    res.status(500).send("posts is not exist and (Error)=>"+err);
    
  }
});

/* -------------------------- like / dislike a post -------------------------- */

router.put("/:id/like", async (req, res) => {
  try {
    const userId=req.body.userId
    const postId=req.params.id
    console.log(`userId:${userId}`)
    const post = await PostModel.findById(postId);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId)
      post.likesCounter=post.likesCounter+1
      await post.save()
      console.log('add like ')
      console.log(`like post shape: ${post}`)
      res.status(200).send(`The post has been liked ${post}`);
    } else {
      const index=post.likes.indexOf(`${userId}`)
      post.likes.splice(index,1)
      post.likesCounter=post.likesCounter-1
      await post.save()
      console.log(`dislike post shape: ${post}`)
      res.status(200).send(`The post has been disliked ${post}`);
    }
  } catch (err) {
    res.status(500).send("Error=>"+err.message);
  }
});





/* ------------------------- 1.last get main page post ------------------------ */
/* 
const user = await UserModel.findOne({_id:req.params.id});
const userPosts = await PostModel.find({ userId: currentUser._id });
*/

router.get("/mainPage/posts", async (req, res) => {
  try {
    const userId=req.query.id
    if(!userId)return res.status(500).send(`userId is requried`)
    const {subsribeToChannel} = await UserModel.findById(userId);
    console.log(` subscript to channel ${subsribeToChannel}` )
    const  friendPosts = await Promise.all(
      subsribeToChannel.map((channelId) => {
        return PostModel
        .find({channelId})
        .limit(3)
        .sort({timestamp:-1}) 
         .populate('userId','username profilePicture')
        /* .populate('channelId','channelName');  */
      })
    );

    let send_posts=[]

   friendPosts.forEach((arr)=>{
    arr.forEach((data)=>{
        send_posts.push(data)
    })
})

    return res.status(200).send(send_posts)
    
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});
 



module.exports = router;