/* const {auth,sendPasswordResetEmail}=require('./firbase')
function restPassword(email,res){
  console.log(email)
  sendPasswordResetEmail(auth, email)
  .then(()=>res.status(200).send(`rest password Link  is sent to your Email`)) 
  .catch(()=>res.status(500).send(`Failed, your account may not exist`));
}
module.exports={restPassword}

 */


