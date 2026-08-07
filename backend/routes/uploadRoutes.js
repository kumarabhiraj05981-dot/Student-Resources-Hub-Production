const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const adminAuth = require("../middleware/adminAuth");


// Cloudinary Storage
const storage = new CloudinaryStorage({

  cloudinary,

  params:{
    folder:"student-resources",
    resource_type:"auto",
  }

});


// Multer Upload
const upload = multer({

  storage,

  limits:{
    fileSize:20 * 1024 * 1024,
  }

});



// Test Route
router.get("/test",(req,res)=>{

  res.json({
    success:true,
    message:"Upload route is working"
  });

});




// Upload Resource (Admin Only)
router.post(
  "/",
  adminAuth,
  upload.single("file"),

  async(req,res)=>{

  try{


    console.log("UPLOAD BODY:",req.body);
    console.log("UPLOAD FILE:",req.file);



    if(!req.file){

      return res.status(400).json({

        success:false,
        message:"Please select a file"

      });

    }



    const {
      title,
      description,
      semester,
      category,
      subject
    } = req.body;



    if(!title || !semester || !category){

      return res.status(400).json({

        success:false,
        message:"Title, semester and category are required"

      });

    }



    const resource = new Resource({

      title:title.trim(),

      description:description || "",

      semester,

      category,

      subject:subject || "",

      fileUrl:req.file.path,

      filePublicId:req.file.filename || "",

      fileName:req.file.originalname || "",

      uploadedBy:req.user._id

    });



    await resource.save();



    console.log("RESOURCE SAVED:",resource);



    return res.status(201).json({

      success:true,

      message:"Resource uploaded and saved successfully!",

      resource

    });



  }catch(error){


    console.error("RESOURCE UPLOAD ERROR:",error);


    return res.status(500).json({

      success:false,

      message:error.message || "Resource upload failed"

    });


  }

});


module.exports = router;