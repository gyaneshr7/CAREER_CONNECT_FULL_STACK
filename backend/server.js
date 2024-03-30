const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const authRoute=require("./routes/auth")
const userRoute=require("./routes/users")
const postRoute=require("./routes/posts")
const categoryRoute=require("./routes/categories");
const resourceRoute=require('./routes/resource');
const multer= require('multer');
const cors=require("cors")
const path=require("path");
dotenv.config();
app.use(express.json())//to parse data into body
/*The require() function is used to import the package which is passed as the param. Here the dotenv is used.

The dotenv is a module that loads environment variables from a .env file that you create and adds them to the process.env object which is then made available to the application.

The config() is a method which is provided by the dotenv module to config the env files.
*/  
// app.use("/",(req,res)=>{
//     console.log("Hey this is main url");
// })   
app.use("/images", express.static(path.join(__dirname,"/images")));
app.use(cors({
    origin: '*'
}));
const port=process.env.PORT;
const MONGO_URI=process.env.MONGO_URL;
// mongoose.set('useFindAndModify', true);
mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    // useFindAndModify:true
    // useCreateIndex:true
}).then(console.log("connected to mongo")).catch((err)=>{
    console.log(err);
})
/*MongoDB database using the provided connection string (MONGO_URI). The additional options ensure that the latest URL parser, server discovery and monitoring engine, and automatic index creation are used for the connection. */


//images storage
const storage = multer.diskStorage({
    destination :(req,file , cb)=>{
        cb(null, "images");
    },
    filename : (req, file, cb)=>{
        cb(null, req.body.name);
    }
})  
const upload = multer({storage:storage});

app.post("/api/upload",upload.single("file"),(req,res) =>{
    res.status(200).json("File has beeen uploaded");
})

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/post",postRoute);
app.use("/api/categories",categoryRoute);
app.use("/api/resource",resourceRoute);

app.listen(7000,(req,res)=>{
    console.log(`Server is listeining is port ${port}`);
})