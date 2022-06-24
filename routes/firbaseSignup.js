const {auth,createUserWithEmailAndPassword}=require('./firbase');
const { deleteUser } =require("firebase/auth")
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

async function createUser(username,email,password,userId,res){
    try{
        //create a new password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
       //create new user 
       const newUser = new User({
       username: username,
       email: email,
       password: hashedPassword,
       uid:userId
       });
       
       //save user and respond 
       const user = await newUser.save();
       const msg={user:user,status:200}
       return res.status(200).send(msg)
    }
      
    catch(err){
        const msg={msg:"mongooseCatch",status:600,err}
        const user = auth.currentUser;
        deleteUser(user).then(() => {
        console.log("Deleted user from firebase")
        return res.status(600).send(msg)
        }).catch((error) => {
        console.log("Error happen can't delete user from firebase")
        return res.status(600).send(msg)
        });
    }
}

function register(username,email,password,res){
    createUserWithEmailAndPassword(auth, email, password)
    .then((G_res) => {
        const userId=G_res.user.uid
        createUser(username,email,password,userId,res)
    
    })

    .catch((err) => {
    if(err.code=="auth/email-already-in-use"){
        error={msg:"firebaseCatch",status:500,err}
        return res.send(error)
    }
    return res.status(600).send(err)
    });

}
module.exports={register,createUser}