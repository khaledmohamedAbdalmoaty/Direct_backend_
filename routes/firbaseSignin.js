const{ getAuth, signInWithEmailAndPassword }=require("firebase/auth") 
const auth = getAuth();
    
function singIn(email,password,res){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    const user = userCredential.user;
    //console.log(user)
    //res.redirect(200,'/user');
    res.status(200).send(`successful login${user.uid}`)

    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(500).send(error)
    });
}
module.exports={singIn}


