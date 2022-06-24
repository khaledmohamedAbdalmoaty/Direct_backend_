const router = require("express").Router();
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const {PostCommentsModel}=require('../models/PostCommentsModel')

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
    .populate('whoSendMsg','_id username') 
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
    const post = await PostModel.findById(PostId);      
    if (post.userId === req.body.userId) {
      await PostModel.deleteOne({_id:PostId})
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
    const post = await PostModel.findById(req.params.id);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId)
      await post.save()
      res.status(200).send(`The post has been liked ${post}`);
    } else {
      const index=post.likes.indexOf(`${userId}`)
      post.likes.splice(index,1)
      await post.save()
      res.status(200).send("The post has been disliked");
    }
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});





/* --------------------------- get timeline posts --------------------------- */


/* outer.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.body.userId);
    const userPosts = await PostModel.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return PostModel.find({ userId: friendId });
      })
    );
    res.send(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
}); */

module.exports = router;