const router = require("express").Router();
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const {PostCommentsModel}=require('../models/PostCommentsModel')
const {EmailInboxModel}=require('../models/MailModel')


/* ----------------------------- create an email ---------------------------- */
/* http://localhost:8800/api/email/sendEmail*/

/* ------------------------------ 1.0 send email ----------------------------- */
router.post("/sendEmail",async (req,res)=>{
  console.log(`inside send Email`)
   
    try{
        const newEmail={
          from:req.body.from ,
          from_id:req.body.from,
          to_id:req.body.to,
          to:req.body.to,
          headerTitle:req.body.headerTitle,
          emailBody:req.body.emailBody,
          enableImage:req.body.enableImage,
          imageLoacation:req.body.imageLoacation || 'imageNotExist' 
        }
     
      const result= new EmailInboxModel(newEmail)
      await result.save()
      res.status(200).send(result)
    }
   
    catch(err){
      res.status(500).send(err.message)
    }
  
  })

/* ------------------------- 1.2 creat an reply on email ------------------------ */
//http://localhost:8800/api/email/
/* http://localhost:8800/api/email/sendReply*/

router.post("/sendReply",async (req,res)=>{
  console.log(`here is request .body`)
  const newReply={
    from:req.body.from ,
    to:req.body.to,
    enableReply:req.body.enableReply,
    replyMessage:req.body.replyMessage,
    replyOnMail:req.body.replyOnMail,
    replyEmailId:req.body.replyOnMail
}
   
    try{
      const result= new EmailInboxModel(newReply)
      await result.save()
      res.status(200).send(result)
    }
   
    catch(err){
      res.status(500).send(err)
    }
  
})



/* ----------------------- 1.3 get email or reply via id of [to]=> user ---------------------- */

/* to full id of this route =>  http://localhost:8800/api/email/to */
router.get("/to", async (req, res) => {
    const toUser=req.query.id
    if(!toUser)return res.status(500).send("id is required")
    try {
      const email = await EmailInboxModel
      .find({to:toUser})
      .populate('to','')
      .populate('from','')
      .populate('replyOnMail','')
      res.status(200).send(email);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});


/* -------------------------------------------------------------------------- */
/*                          get all your Email & reply                         */
/* -------------------------------------------------------------------------- */
/* to full id of this route =>  http://localhost:8800/api/email/to */
router.get("/from/:fromUserId", async (req, res) => {
/*   console.log(`the wrong route man `)
 */  const fromUser=req.params.fromUserId
  console.log(`test 1.3.1:${fromUser}`)
  console.log(`get email or reply via id of from user:=>${fromUser}`)
  if(!fromUser)return res.status(500).send({message:"id is required"})
  try {
    const email = await EmailInboxModel
    .find({from:fromUser})
    .populate('to','_id username profilePicture')
    .populate('from','_id username profilePicture')
    .populate('replyOnMail','')
    res.status(200).send(email);
  } catch (err) {
    res.status(500).send({message:err.message});
  }
});

  

/* -------------------------------------------------------------------------- */
/*                       get all Email from user To you                       */
/* -------------------------------------------------------------------------- */
/* to full id of this route =>  http://localhost:8800/api/email/from/to */
router.get("/allEmail/fromUser/toYou", async (req, res) => {
    const toUser=req.query.to
    const fromUser=req.query.from
    console.log(`from:${fromUser},to:${toUser}`)
  if(!toUser || !fromUser )return res.status(500).send("id is required")
    try {
      const email = await EmailInboxModel
      .find({enableReply:false,to:toUser,from:fromUser})
      .populate('to','')
      .populate('from','')
      res.status(200).send(email);
    } catch (err) {
      console.log(`eror is from email=>${err.message}`)
      res.status(500).send("Error=>"+err.message);
    }
});


/* -------------------------------------------------------------------------- */
/*                        get All-Reply from user To you                       */
/* -------------------------------------------------------------------------- */
/* http://localhost:8800/api/email/from/to  */

router.get("/reply/from/to", async (req, res) => {
  const EmailId=req.query.id
  
if(!EmailId)return res.status(500).send("id is required")
  try {
    const reply = await EmailInboxModel
    .find({replyEmailId:EmailId,enableReply:true})
    .populate('to','')
    .populate('from','')
    res.status(200).send(reply);
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});


/* -------------------------------------------------------------------------- */
/*                       1.5 get specific email with it's id                      */
/* -------------------------------------------------------------------------- */
//http:
router.get("/singleEmail", async (req, res) => {
  const EmailId=req.query.id
  
  /*console.log(`from user ${fromUser} &&toUser ${toUser}`)*/  
if(!EmailId)return res.status(500).send("id is required")
  try {
    const email = await EmailInboxModel
    .find({_id:EmailId})
    .populate('to','')
    .populate('from','')
    res.status(200).send(email[0]);
  } catch (err) {
    res.status(500).send("Error=>"+err);
  }
});



module.exports = router;