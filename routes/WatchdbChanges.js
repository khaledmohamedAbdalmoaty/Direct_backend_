const Pusher=require('pusher')
const mongoose=require('mongoose')


/* -------------------------- pusher configuration -------------------------- */
const pusher = new Pusher({
    appId: "1364105",
     key: "09ee181751da269dbb46",
    secret: "3b9335e8f0615505d5f1",
    cluster: "eu",
    useTLS: true
});
  
  
/* ---------------- watch the change on Channels--------------- */
const db=mongoose.connection
const WatchdbChanges=db.once("open",()=>{
    console.log("Db connected watch")
    let msgCollection=db.collection("channels");
    let changeStream=msgCollection.watch();
    //console.log(changeStream)
    try{
        changeStream.on("change",(change)=>{
            console.log("change occured",change)
            if(change.operationType === `insert`){
                pusher.trigger('channels','newChannel',{
                    'change':change
                })
            }else if(change.operationType=='update'){
                pusher.trigger('conversation','newMessage',{
                    'change':change 
                })
            }else{
                console.log('Error triggering pusher')
            }
        
        });

    }
    catch(err){
        console.log("you are not connected to internet ")
    }
  
  
})   
  
module.exports={WatchdbChanges}