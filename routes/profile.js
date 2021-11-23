const router = require('express').Router();
const Editor = require('../models/Editor')
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')
const fileUploader = require('../config/cloudinary');

router.get('/profile', isLoggedIn, (req,res,next) => {
    const id = req.session.user._id;
    
    Editor.findById(id)
        .then(foundUser => {
            res.render('editor/profile', foundUser)
        })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router;