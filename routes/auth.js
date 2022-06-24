const router = require("express").Router();
const {register}=require("./firbaseSignup")
const {singIn}=require(`./firbaseSignin`)
const {restPassword}=require(`./firbaseRestPassword.js`)
/* -------------------------------- REGISTER User-------------------------------- */
router.post("/register", async (req, res) => {
  username=req.body.username
  email=req.body.email
  password=req.body.password
  register(username,email,password,res)
});


/* ---------------------------------- LOGIN --------------------------------- */
router.post("/login", async (req, res) => {
  email=req.body.email
  password=req.body.password
  singIn(email,password,res)
});

/* ---------------------------------- resetPassword --------------------------------- */
router.post("/resetpassword", async (req, res) => {
  email=req.body.email
  restPassword(email,res)
});


module.exports=router