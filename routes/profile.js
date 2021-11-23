const router = require('express').Router();
const Editor = require('../models/Editor')
const isLoggedIn = require('../middleware/isLoggedIn')

router.get('/profile', isLoggedIn,(req,res,next) => {
    const id = req.session.user._id;
    
    Editor.findById(id)
        .then(foundUser => {
            res.render('editor/profile', foundUser)
        })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})

router.get('/profile/edit',(req, res, next) => {
    const id = req.session.user._id;

    Editor.findById(id)
        .then(foundEditor => {
            // res.send(foundEditor)
            res.render('editor/edit-profile', foundEditor)
        })

});


module.exports = router;