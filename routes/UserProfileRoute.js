const router = require("express").Router();
const {UserEducaionModel,UserSkillsModel,UserProjectsModel} =require('../models/UserProfileModels')
const UserModel = require("../models/UserModel");

/* -------------------------------------------------------------------------- */
/*                         1-UserModel routes                        */
/* -------------------------------------------------------------------------- */

/* http://localhost:8800/api/userProfile/generalUserInfo */

/* ----------------------- 1.1get General user info Data ----------------------- */
router.get("/generalUserInfo", async (req, res) => {
 
    try {
      const userId=req.query.id
      if(!userId)return res.status(500).send("id is required")
      const userInfo = await UserModel
      .findById(userId)
      res.status(200).send(userInfo);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});


/* ----------------------------1.2 update work title --------------------------- */

router.put('/workTitle',async(req,res)=>{
   
    try{
        const userId=req.body.userId
        const workTitle=req.body.workTitle
        if( !userId || !workTitle)return res.status(500).send('id is required');
        await  UserModel.updateOne({_id:userId},{ $set: {workTitle} });
        const response={msg:'userInfo has been update'}
        res.status(200).send(response);
    }
    catch(err){
        res.status(500).send(err)
    }

})

/* ------------------------- 1.3update user about filed ------------------------ */

router.put('/userAbout',async(req,res)=>{
    
    try{
    const userId=req.body.userId
    const About=req.body.About
    if(!userId || !About)return res.status(500).send('id is required')
        await  UserModel.updateOne({_id:userId},{ $set: {About} });
        const response={msg:'userAbout has been update'}
        return res.status(200).send(response);
    }
    catch(err){
        res.status(500).send(err)
    }
})


/* -------------------------1.4 update user photo image ------------------------ */
router.put('/userImageLocation',async(req,res)=>{
    
    try{
    const userId=req.body.userId
    const userImageLocation=req.body.userImageLocation
    if(!userId || !userImageLocation)return res.status(500).send('id is required')
        await  UserModel.updateOne({_id:userId},{ $set: {profilePicture:userImageLocation} });
        const response={msg:'useruserImageLocation has been update'}
        return res.status(200).send(response);
    }
    catch(err){
        res.status(500).send(err)
    }
})


/* -------------------------------------------------------------------------- */
/*                             2- education schema                            */
/* -------------------------------------------------------------------------- */

/* ------------------------2.1 get user education schema ----------------------- */

router.get("/getEducation", async (req, res) => {
    
    try {
    const userId=req.query.id
    if(!userId)return res.status(500).send("id is required")
      const userEducation = await UserEducaionModel
      .find({userId})
     
      res.status(200).send(userEducation);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});

/* ------------------------ 2.2 create userEducation card ----------------------- */
  
router.post("/postEducation", async (req, res) => {
   
    try {
        const userId=req.body.userId
        if(!userId)return res.status(500).send("id is required")
        const educationCard={
            userId,
            schoolName:req.body.schoolName,
            schoolStartTime:req.body.schoolStartTime,
            schoolEndTime:req.body.schoolEndTime,
            schoolDesc:req.body.schoolDesc
        }
      const newUserEducationCard = new UserEducaionModel(educationCard)
      await newUserEducationCard.save()
      res.status(200).send(newUserEducationCard);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});


/* -----------------------2.3 delete user education card ----------------------- */
router.delete('/deleteEducation',async(req,res)=>{
  
    try{
        const id=req.body.educationCardId
        const userId=req.body.userId
        console.log(`from delted education userId: =>${userId}`)
        console.log(`from delted education cardId: =>${id}`)

        if(!id || !userId )return res.status(500).send('id is required')
        const educationCardInfo = await UserEducaionModel
        .findById(id);
        if (educationCardInfo.userId === userId) {
            await  UserEducaionModel.deleteOne({_id:id});
            const response={msg:'educationCardInfo has been deleted',educationCardInfo}
            return res.status(200).send(response);
        }
        else{
            res.status(403).send("you can delete only your profile");
        }

    }
    catch(err){
        res.status(500).send(err.message)
    }

})

/* ------------------------- 2.4 edit education card ------------------------ */
  
router.put("/editEducation", async (req, res) => {
    console.log(req.body.userId)
    console.log(req.body.schoolId)
    console.log(req.body.schoolStartTime)
    console.log(req.body.schoolEndTime)
    console.log(req.body.schoolDesc)

   
    try {
        const userId=req.body.userId
        const schoolId=req.body.schoolId
        if(!userId || !schoolId)return res.status(500).send("id is required")
        const oldSchool=await  UserEducaionModel.findById(schoolId)
        if(oldSchool.userId===userId){
            const NewEducationCard={
                schoolName:req.body.schoolName,
                schoolStartTime:req.body.schoolStartTime,
                schoolEndTime:req.body.schoolEndTime,
                schoolDesc:req.body.schoolDesc
            }
            const response=await UserEducaionModel.update({_id:schoolId},{$set:NewEducationCard})
            const result={msg:'old projectCard has been updated',response}
            return res.status(200).send(result);
        }
        else{
            res.status(403).send("you can edit only your profile");
        }

    } catch (err) {
      res.status(500).send("Error=>"+err.message);
    }
});



/* -------------------------------------------------------------------------- */
/*                           3- skills schema route                           */
/* -------------------------------------------------------------------------- */


/* ------------------------ 3.1get user skills  ----------------------- */

router.get("/getSkills", async (req, res) => {
    
    try {
    const userId=req.query.id
    if(!userId)return res.status(500).send("id is required")
      const userSkills = await UserSkillsModel
      .find({userId})
     
      res.status(200).send(userSkills);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});

/* ------------------------ 3.2create user skill ----------------------- */
  
router.post("/postSkill", async (req, res) => {
   
    try {
        const userId=req.body.userId
        const  skillName=req.body.skillName
        if(!userId || !skillName)return res.status(500).send("id is required")
        const skill={
            userId,
            skillName
        }
      const newUserskill = new UserSkillsModel(skill)
      await newUserskill.save()
      res.status(200).send(newUserskill);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});

/* ----------------------- 3.3delete user skill card ----------------------- */
router.delete('/deleteSkill',async(req,res)=>{
    try{
        const id=req.body.skillId
        const userId=req.body.userId
        if(!id || !userId )return res.status(500).send('id is required')
        const skill = await UserSkillsModel
        .findById(id);
        if (skill.userId === userId) {
            await  UserSkillsModel.deleteOne({_id:id});
            const response={msg:'skill has been deleted',skill}
            return res.status(200).send(response);
        }
        else{
            res.status(403).send("you can delete only your profile");
        }

    }
    catch(err){
        res.status(500).send(err)
    }

})


/* -------------------------------------------------------------------------- */
/*                              4- project route                              */
/* -------------------------------------------------------------------------- */



/* ------------------------4.1 get user projects ----------------------- */

router.get("/getProjects", async (req, res) => {
    
    try {
    const userId=req.query.id
    if(!userId)return res.status(500).send("id is required")
      const projects = await UserProjectsModel
      .find({userId})
     
      res.status(200).send(projects);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});

/* ------------------------4.2 create userProjects card ----------------------- */

router.post("/postProject", async (req, res) => {
   
    try {
        const userId=req.body.userId
        if(!userId)return res.status(500).send("id is required")
        const projectCard={
            userId,
            projectName:req.body.projectName,
            projectStartTime:req.body.projectStartTime,
            projectEndTime:req.body.projectEndTime,
            projectDesc:req.body.projectDesc,
            link:req.body.link
        }
      const newUserProjectCard = new UserProjectsModel(projectCard)
      await newUserProjectCard.save()
      res.status(200).send(newUserProjectCard);
    } catch (err) {
      res.status(500).send("Error=>"+err);
    }
});


/* ----------------------- 4.3 Delete user project card ----------------------- */
router.delete('/deleteProject',async(req,res)=>{
    try{
        const id=req.body.projectId
        const userId=req.body.userId
        if(!id || !userId )return res.status(500).send('id is required')
        const projectInfo = await UserProjectsModel
        .findById(id);
        if (projectInfo.userId === userId) {
            await  UserProjectsModel.deleteOne({_id:id});
            const response={msg:'projectInfo has been deleted',projectInfo}
            return res.status(200).send(response);
        }
        else{
            res.status(403).send("you can delete only your profile");
        }

    }
    catch(err){
        res.status(500).send(err)
    }

})



/* ----------------------------------- 4.4 ---------------------------------- */
router.put('/editProject',async(req,res)=>{
    try{
        const projectId=req.body.projectId
        const userId=req.body.userId
        if(!projectId || !userId )return res.status(500).send('id is required')
        const oldProject = await UserProjectsModel
        .findById(projectId);
        if (oldProject.userId === userId) {
            const newProject={
                projectName:req.body.projectName,
                projectStartTime:req.body.projectStartTime,
                projectEndTime:req.body.projectEndTime,
                projectDesc:req.body.projectDesc,
                link:req.body.link,
            }
            const response=await  UserProjectsModel.updateOne({_id:projectId},{$set:newProject});
            const result={msg:'oldProject has been updated',response}
            return res.status(200).send(result);
        }
        else{
            res.status(403).send("you can edit only your profile");
        }

    }
    catch(err){
        res.status(500).send(err)
    }

})


module.exports = router;