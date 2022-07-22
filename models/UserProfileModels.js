const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema={type:mongoose.Schema.Types.ObjectId,ref:'Users',required: true}
const postSchema={type:mongoose.Schema.Types.ObjectId,ref:'Posts',required:true}
const insideEmailSchema={type:mongoose.Schema.Types.ObjectId,ref:'EmailInbox'}


/* -------------------------------------------------------------------------- */
/*                             1. education Schema                              */
/* -------------------------------------------------------------------------- */
const EducationSchema = new mongoose.Schema(
  {
    userId:String,
    schoolName:{type:String,required:true},
    schoolStartTime:{type:String,required:true},
    schoolEndTime:{type:String,default:'~'},
    schoolDesc:String
  },
  { timestamps: true }  
);


/* -------------------------------------------------------------------------- */
/*                              2.  skills schema                               */
/* -------------------------------------------------------------------------- */

const SkillsSchema = new mongoose.Schema(
  {
   userId:String,
    skillName:{type:String,required:true}
  },
  { timestamps: true }  
);


/* -------------------------------------------------------------------------- */
/*                               3. project Schema                               */
/* -------------------------------------------------------------------------- */

const ProjectSchema = new mongoose.Schema(
  {
   userId:String,
   projectName:{type:String,required:true},
   projectStartTime:String,
   projectEndTime:{type:String,default:'~'},
   projectDesc:String,
   link:{type:String,default:'null'}
  },
  { timestamps: true }  
);




const UserEducaionModel=mongoose.model(`UserEducation`,EducationSchema)
const UserSkillsModel=mongoose.model(`UserSkills`,SkillsSchema)
const UserProjectsModel=mongoose.model(`UserProjects`,ProjectSchema)



module.exports={UserEducaionModel,UserSkillsModel,UserProjectsModel}





