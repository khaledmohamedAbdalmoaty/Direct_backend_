const router=require("express").Router()
const multer  = require('multer')
 

/* -------------------------- multer configuration -------------------------- */

/* /media/khaled/Disk_2_319G/1/graduation_project/front-end/public/images
 */
/* const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'/media/khaled/Disk_2_319G/1/graduation_project/front-end/public/images')
    },
    filename:(req,file,cb)=>{
        console.log(` the attribute of the file => ${file}`)
        cb(null,Date.now()+file.originalname+".png") //to decide the name of saved file 
    }
})


const upload=multer({storage:fileStorageEngine});

 */


/* 
const  storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{

        cb(null,req.body.fileName)
         cb(null,`${file.originalname.split('.')[0]}.jpg`) 
    }
})
 */


/* const upload=multer({
    storage,
    limits:{fileSize:20000000},
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
            return cb(new Error(`please upload an image with type of jpg or png`))
        }
        cb(undefined, true)
    }

});
 */

/* -------------------------------------------------------------------------- */
/*                           try multer upload file                           */
/* -------------------------------------------------------------------------- */


const  storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})


const upload=multer({
    storage
});



router.post('/single',upload.single('image'),(req,res)=>{
   try{
    console.log(`to know the name of uploaded image => ${req.file.filename}`)
    res.status(200).send(req.file.filename)
   }
   catch(err){
   res.status(500).send(`image doesn't uploaded `)
   }
})




/* -------------------------------------------------------------------------- */
/*                       end of try multer uploded file                       */
/* -------------------------------------------------------------------------- */

/* --------------------- upload a single file via multer -------------------- */
/* 
router.post('/single',upload.single('image'),(req,res)=>{
    console.log(req.file)
    res.status(200).send(req.file.filename)
}) */

/* ----------------------- upload many file via multer ---------------------- */

router.post('/mulitple',upload.array('images',3),(req,res)=>{
    console.log(req.files);
    res.send('Mulipl files upload success')
})

module.exports=router