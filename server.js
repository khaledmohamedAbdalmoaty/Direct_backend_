const express =require("express");
const app = express();
const {connectToDb}=require('./models/databaseConfig')
const dotenv = require("dotenv");
dotenv.config();
const helmet=require('helmet')
const morgan=require('morgan')
const cors=require('cors')
const path=require('path')

/* --------------------------- other router folder -------------------------- */
const tryRoute=require("./routes/try")
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/auth");
const PostRoute = require("./routes/PostRoute");
const multerRoute =require('./routes/multerRoute')

const ChannelRoute=require('./routes/ChannelRoute')
const ChatRoute=require('./routes/ChatRoute')
//const ChannelRoute=require('Location')


/* --------------------------- connect to database -------------------------- */
connectToDb

/* ------------------------- watch database changes ------------------------- */
/* WatchdbChanges */

/* --------------------------- middleware function -------------------------- */
/* app.use(function(req,res,next){
   res.header("Access-Control-Allow-Origin","*")
   res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
   next()
})  */

app.use(cors());  
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use('/images',express.static(path.join(__dirname,"public/images"))) 
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", PostRoute);
app.use('/api/channel',ChannelRoute)
app.use('/api/chat',ChatRoute)
app.use('/api/upLoadFile',multerRoute)
/* -------------------------------------------------------------------------- */
/*                                  try route                                 */
/* -------------------------------------------------------------------------- */
/* app.use("/try",tryRoute) */


/* ----------------------------- listen on port ----------------------------- */
const PORT=8800
app.listen(PORT, function () {
    console.log(`The SERVER HAS STARTED ON PORT: ${PORT}`);
})

