const router = require('express').Router()
const Editor = require('../models/Editor');
const Post = require('../models/Post');

router.get("/guest/guestView",  (req, res, next) => {
    const {title, content, editorId} = req.body
    Post.find()
    .then(postFromDB => {
        res.render('guest/guestView', { post: postFromDB[Math.floor(Math.random()  * postFromDB.length)] })
    })
  });

module.exports = router