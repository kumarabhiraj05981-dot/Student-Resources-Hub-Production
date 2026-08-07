const express = require("express");
const Resource = require("../models/Resource");

const router = express.Router();


// Get All Resources
router.get("/", async (req, res) => {
  try {

    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });


  } catch(error){

    console.error("Get resources error:", error);

    res.status(500).json({
      success:false,
      message:"Failed to load resources"
    });

  }
});




// Get By Category
router.get("/category/:category", async(req,res)=>{

try{

const resources = await Resource.find({
 category:req.params.category
})
.sort({
 createdAt:-1
});


res.json({
 success:true,
 count:resources.length,
 resources
});


}catch(error){

res.status(500).json({
 success:false,
 message:error.message
});

}

});




// Get By Semester
router.get("/semester/:semester", async(req,res)=>{

try{

const resources = await Resource.find({
 semester:req.params.semester
})
.sort({
 createdAt:-1
});


res.json({
 success:true,
 count:resources.length,
 resources
});


}catch(error){

res.status(500).json({
 success:false,
 message:error.message
});

}

});




// Search Resource
router.get("/search/:keyword", async(req,res)=>{

try{

const resources = await Resource.find({

title:{
 $regex:req.params.keyword,
 $options:"i"
}

});


res.json({
 success:true,
 resources
});


}catch(error){

res.status(500).json({
 success:false,
 message:error.message
});

}

});



module.exports = router;