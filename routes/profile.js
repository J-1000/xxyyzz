const router = require('express').Router();
const Editor = require('../models/Editor')

router.get('/profile',(req,res,next) => {
    
    
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

module.exports = router;