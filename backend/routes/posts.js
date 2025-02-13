const router = require("express").Router();

// const { ObjectId } = require("mongodb");
const Post = require("../models/Post");
const User = require("../models/User");

const bcrypt = require("bcrypt");
//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  // console.log(newPost);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get companies
router.get("/companies", async (req, res) => {
  try {
    const posts = await Post.find({}, "company"); // Fetch only the 'company' field of all posts

    const companiesSet = new Set(posts.map((post) => post.company)); // Extract and create a set of unique company names
    const companies = Array.from(companiesSet); // Convert the set back to an array
    res.json(companies);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);



























    
  }
});

//  update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ENDPOINT TO FETCH ALL POSTS ON THE BASIS OF COMPANY
router.get("/get/:company", async (req, res) => {
  const username = req.query.user;
  // const catName=req.query.cat;

  /*
    req.query takes parameters in the URL (mainly GET method) example for this URL ► http://localhost/books?author=Asimov app.get('/books/', (req, res) => { console.log(req.query.author) } will return Asimov
    app.get('/hi/:param1', function(req,res){} );
// regex version
app.get(/^\/hi\/(.*)$/, function(req,res){} );
// unnamed wild card
app.get('/hi/*', function(req,res){} );
and given this URL http://www.google.com/hi/there?qs1=you&qs2=tube

You will have:

req.query

{
  qs1: 'you',
  qs2: 'tube'
}
req.params

{
  param1: 'there'
}
     */
  try {
    let posts;
    if (req.params.company === "All") {
      if (username) {
        posts = await Post.find({ username });
      } else {
        posts = await Post.find();
      }
    } else {
      if (username) {
        posts = await Post.find({ username, company: req.params.company });
      } else {
        posts = await Post.find({ company: req.params.company });
      }
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST ON THE BASIS OF ID
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        const postTitle = req.body.title; // Delete http requests usually use a query and not a body

        await Post.deleteOne({ title: postTitle });
        // await Post.destroy({
        //     where: {
        //         title: postTitle
        //     }
        // })
        //    await post.delete();
        //    await post.deleteOne({"_id":ObjectId(`${post._id}`)}) ;
        console.log("Helo");

        res.status(200).json("Post has been deleted");
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can Delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//getpost
router.get("/dummy", async (req, res) => {
  console.log("dummy endpoint");
});
//getall post

module.exports = router;
