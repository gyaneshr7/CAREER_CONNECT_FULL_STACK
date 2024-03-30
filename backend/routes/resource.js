const router = require('express').Router();
const Resource = require('../models/Resource');


router.get('/getAllResource/:title', (req, res) => {
    var mySort = { date: -1 };
    Resource.find({ title: req.params.title })
      .sort(mySort)
      .then(posts => {
        // console.log(posts)
        res.json(posts)
      })
      .catch(err => {
        console.log(err)
      })
  })

  router.get('/getAllResource', (req, res) => {
    var mySort = { date: -1 };
    Resource.find({})
      .sort(mySort)
      .then(posts => {
        // console.log(posts)
        res.json(posts)
      })
      .catch(err => {
        console.log(err)
      })
  })

  module.exports = router;