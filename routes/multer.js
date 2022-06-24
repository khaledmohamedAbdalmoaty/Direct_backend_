
const express = require('express')
const multer  = require('multer')

const app = express()

const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'---'+file.originalname) //to decide the name of saved file 
    }
})


const upload=multer({storage:fileStorageEngine});

app.post('/single',upload.single('image'),(req,res)=>{
    console.log(req.file)
    res.send('single file upload success')
})

app.post('/mulitple',upload.array('images',3),(req,res)=>{
    console.log(req.files);
    res.send('Mulipl files upload success')
})


const PORT=8800
app.listen(PORT, function () {
    console.log(`The SERVER HAS STARTED ON PORT: ${PORT}`);
})
