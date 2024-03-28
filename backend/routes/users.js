const router= require('express').Router();

const Post =require("../models/Post");
const User =require("../models/User");
   
const bcrypt=require('bcrypt');
//Update
router.put("/:id", async(req, res)=>{
     if(req.body.userId === req.params.id){
         if(req.body.password){
        const salt=await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(req.body.password,salt);
    
        }

      try{
          
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set : req.body,
        },{new:true}) 
        //new true likhne se updated vala direct yhi dikhne lgega bjay ki purane ke
        res.status(200).json(updatedUser);
      }catch(err){
           res.status(500).json(err);
        }

     }else{
        res.status(401).json("You can update only your account");
     }
} )
//DELETE
router.delete("/:id", async(req, res)=>{   
   // console.log(req.body)

   console.log(req.body.userId+" "+req.params.id)
   if(req.body.userId === req.params.id){
      try{   
     console.log("Hey2")

    //   const user = await User.findById(req.params.id);  
      const user = await User.findOne({_id:req.body.userId});
      // console.log(user);
    //   if(!user){
    //     res.status(404).json("User not found!");
    //   }
    try{  
        await Post.deleteMany({username:user.username})
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted");
        }catch(err){
            console.log(err)
             res.status(500).json(err);
          }
  }catch(err){
      res.status(404).json("User not found!");
  }
     

    }else{
       res.status(401).json("You can Delte only your account blogs");
    }
} )

//get single user
router.get("/:id",async(req,res)=>{
   try{
   const user= await User.findById(req.params.id);
   const {password,...others}=user._doc;
   res.status(200).json(others);

   }catch(err){
      res.status(500).json(err);
   }
})
module.exports=router;