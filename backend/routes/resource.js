const router = require("express").Router();
const path = require("path");
const Resource = require("../models/Resource");
const multer = require("multer");
const fs = require("fs");

// Get the parent directory of the routes directory (assuming 'routes' is the immediate child of the parent directory)
const parentDirectory = path.dirname(__dirname);
const filesDirectory = path.join(parentDirectory, "files");

// Set up multer storage
const storage = multer.diskStorage({
  destination: filesDirectory,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/getResource/:title", (req, res) => {
  var mySort = { date: -1 };
  Resource.find({ title: req.params.title })
    .sort(mySort)
    .then((posts) => {
      // console.log(posts)
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getAllResource", (req, res) => {
  var mySort = { date: -1 };
  Resource.find({})
    .sort(mySort)
    .then((posts) => {
      // console.log(posts)
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Endpoint to upload the file to the local directory
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileName = req.file.originalname;
    const filePath = path.join(filesDirectory, fileName);

    let uploadData;
    uploadData = await Resource.findOne({ filePath });

    if (uploadData)
      return res.status(404).json({ error: true });

    uploadData = await Resource.create({
      title: req.body.title,
      type: "pdf",
      filePath,
    });

    // json the file name back as a response
    res.json({ fileName });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/download", async (req, res) => {
  try {
    const fileName = req.query.fileName;
    const filePath = path.join(filesDirectory, fileName);

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json("File not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const filePath = resource.filePath;
    console.log(filePath);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json("Failed to delete file");
        } else {
          const deleteFile = await Resource.findByIdAndDelete(req.params.id);
          res.status(200).json("File deleted successfully");
        }
      });
    } else {
      res.status(404).json("File not found");
    }
  } catch (err) {}
});

module.exports = router;
