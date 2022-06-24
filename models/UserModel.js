const mongoose=require('mongoose')
const Schema=mongoose.Schema

/* -------------------------------------------------------------------------- */
/*                             creat a user shcema                            */
/* -------------------------------------------------------------------------- */
const UserSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        min: 3,
        max: 20, 
      },
      uid:{
        type: String
      },
      userImageLocation:String ,
      email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 6,
        unique: true
      },
      profilePicture: {
        type: String,
        default: "",
      },
      coverPicture: {
        type: String,
        default: "",
      },
      subsribeToChannel: {
        type: Array,
        default: [],
     
      },
      userChannel: {
        type: Array,
        default: [],
      },
      
    },
  
    { timestamps: true }
);


module.exports = mongoose.model("Users", UserSchema);




