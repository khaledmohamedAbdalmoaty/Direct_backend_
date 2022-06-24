const mongoose=require('mongoose')



/* -------------------------------------------------------------------------- */
/*                        create a mongoose connection                        */
/* -------------------------------------------------------------------------- */
databaseName="Graduation-project41"

const connectToDb=mongoose.connect(`mongodb://localhost:27017/${databaseName}`,{ useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>console.log(`connect to DB => ${databaseName}`))
.catch((err)=>console.log(`${err}`))
module.exports ={connectToDb}


