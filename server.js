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
/* const tryRoute=require("./routes/try")
 */
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/auth");
const PostRoute = require("./routes/PostRoute");
const multerRoute =require('./routes/multerRoute')
const EmailRoute =require('./routes/EmailRoute')

const ChannelRoute=require('./routes/ChannelRoute')
const ChatRoute=require('./routes/ChatRoute')

const userProfileRoute=require('./routes/UserProfileRoute')
//const ChannelRoute=require('Location')


/* --------------------------- connect to database -------------------------- */
connectToDb
/* getUserChannel */
/* ------------------------- watch database changes ------------------------- */
/* require('./routes/WatchdbChanges') */

/* --------------------------- middleware function -------------------------- */
/* app.use(function(req,res,next){
   res.setHeader("Access-Control-Allow-Origin",'*')
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
    next()
})   */

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
app.use('/api/email',EmailRoute)
app.use('/api/userProfile',userProfileRoute)

/* -------------------------------------------------------------------------- */
/*                           socket.io configuration                          */
/* -------------------------------------------------------------------------- */
const server=require('http').createServer(app)
const io =require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
})

io.on('connection',(socket)=>{
    console.log(`what is the socket is :${socket}`)
    console.log(`socket is begin active `)

    /* ------------------------ listent to event listener ----------------------- */
    socket.on('change',(payload)=>{
        console.log('the shape of payload that become on listening to event:',payload)
        io.emit("update",payload)
    })

})



/* ----------------------------- listen on port ----------------------------- */
const PORT=8800
server.listen(PORT, function () {
    console.log(`server of socket.io is listening on port:${PORT}`)
})

