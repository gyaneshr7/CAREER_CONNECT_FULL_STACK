const router= require('express').Router();

const User =require("../models/User");
 
const bcrypt=require('bcrypt');
//Register    
router.post("/register", async(req, res)=>{
     try{    
const salt=await bcrypt.genSalt(10);
const hashPass=await bcrypt.hash(req.body.password,salt);

        const newUser= new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPass
        }) 
        const user= await newUser.save();
        res.status(200).json(user)
     }catch(err){ 
      console.log("regisger err: "+ err);
      res.status(500).json(err);
     }
} )
//Login

router.post("/login",async(req,res)=>{
    try{
         
        const user = await User.findOne({username:req.body.username});
        if(!user){
            res.status(400).json("wrong credentials Here username");
        } 
  const validated = await bcrypt.compare(req.body.password,user.password);
         
  if(!validated){
    res.status(400).json("wrong credentials Here Password");
  }   
  const {password, ...others}=user._doc; //we dont send the password to the user
  res.status(200).json(others);

    }catch(err){
        console.log("login err: "+ err);
        res.status(500).json(err);
    }
})


module.exports=router;