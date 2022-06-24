const UserModel = require("../models/UserModel");
const router = require("express").Router();
const bcrypt = require("bcrypt");

/* ------------------------------- update user ------------------------------ */
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
    /*   try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).send(err);
      } */
      //update password at google 
    }
    try {
      const user = await UserModel.updateOne({_id:req.params.id},{
        $set: req.body,
      });
      if(user===null){
        return res.status(404).send("user do not exist")
      }
      res.status(200).send("user has been updated");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send("You can update only your account!");
  }
});


/* ---------------------------- change user name ---------------------------- */
router.put("/userName/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const new_name={username:req.body.username}
      const user = await UserModel.updateOne({_id:req.params.id},{
        $set: new_name,
      });
      if(user===null){
        return res.status(404).send("user do not exist")
      }
      res.status(200).send("user has been updated");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).send("You can update only your account!");
  }
});

  
/* ------------------------------- delete user ------------------------------ */

router.delete("/:id", async (req, res) => {
  
    try {
      const result=await UserModel.deleteOne({uid:req.params.id});
      if(result===null){
        res.status(404).send("user does not exist ")
      }
      res.status(200).send("Account has been deleted");
    } catch (err) {
      return res.status(500).send(err);
    }
 
});



/* ------------------------------- get a user by uid ------------------------------- */
 router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findOne({uid:req.params.id});
    const { password, ...other } = user._doc;
    res.status(200).send(other);
  } catch (err) {
    res.status(500).send(err);
  }
}); 

/* -------------------- get user information via it's _id ------------------- */

router.get("/id/:id", async (req, res) => {
  try {
    const user = await UserModel.findOne({_id:req.params.id});
    const { password, ...other } = user._doc;
    res.status(200).send(other);
  } catch (err) {
    res.status(500).send(err);
  }
}); 


/* -------------------- get user _Id via it's uid -------------------- */
router.get("/id_/:id", async (req, res) => {
    const uid=req.params.id
    if(!uid){return res.status(500).send('##Error##')}
  try {
    const user = await UserModel.findOne({uid});
    const {_id,...others}=user
    res.status(200).send({_id});
  } catch (err) {
    res.status(500).send(err);
  }
}); 


/* ---------------------- get all user in our database ---------------------- */
router.post("/users",async(req, res) => {

try {
  const users = await UserModel.find({});
  res.status(200).send(users);
}
catch (err) {
  res.status(500).send(err);
}

}); 


module.exports = router;