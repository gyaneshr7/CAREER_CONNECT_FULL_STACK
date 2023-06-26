const router= require('express').Router();

const { ObjectId } = require('mongodb');
const Post =require("../models/Post");
const User =require("../models/User");
   
const bcrypt=require('bcrypt');
//CREATE POST
router.post('/',async(req,res)=>{
    const newPost=new Post(req.body);
    try{
const savedPost=await newPost.save();
res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
})
//  update post
router.put("/:id", async(req, res)=>{
    
    try{
         const post=await Post.findById(req.params.id);
         if(post.username===req.body.username){
            try{
         
                const updatedPost=await  Post.findByIdAndUpdate(req.params.id,{
                    $set : req.body,
                },{new:true})   
                res.status(200).json(updatedPost)
            }catch(err){
                res.status(500).json(err);
            }
         }else{

             res.status(401).json("You can update only your post");
         }
    }catch(err){
        res.status(500).json(err);
    }
} )
//DELETE
router.delete("/:id", async(req, res)=>{  
    try{
        const post=await Post.findById(req.params.id);
        console.log(post);
        console.log(req);
        if(post.username===req.body.username){
           try{  
            const postTitle = req.body.title// Delete http requests usually use a query and not a body 

              await Post.deleteOne({title:postTitle})
            // await Post.destroy({
            //     where: {
            //         title: postTitle
            //     }
            // })
            //    await post.delete();
            //    await post.deleteOne({"_id":ObjectId(`${post._id}`)}) ;
               console.log("Helo")

               res.status(200).json("Post has been deleted");
           }catch(err){
            console.log(err)
               res.status(500).json(err);
           }
        }else{

            res.status(401).json("You can Delete only your post");
        }
   }catch(err){
       res.status(500).json(err);
   }
})  

//getpost
router.get("/:id",async(req,res)=>{
    try{
    
const post=await Post.findById(req.params.id);
res.status(200).json(post)
    }catch(err){
        res.status(500).json(err);
    }
})  

//getall post
router.get("/",async(req,res)=>{  
    const username=req.query.user;
    const catName=req.query.cat;
    try{
         let posts;
         if(username){
            posts=await Post.find({username})
        }else if(catName){
             posts=await Post.find({categories:{
                $in:[catName]
             }})

         }else{
            posts=await Post.find();
         }
        res.status(200).json(posts);

    }catch(err){
        res.status(500).json(err);
    }
})
module.exports=router;